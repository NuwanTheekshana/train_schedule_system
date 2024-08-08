using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using train_schedule_system_backend.Common;
using train_schedule_system_backend.Models;

namespace train_schedule_system_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrationController : Controller
    {
        private readonly IConfiguration _configuration;

        public RegistrationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        [Route("registration")]
        public IActionResult Registration(Registration registration)
        {

            Models.Response response = new Models.Response();
            try
            {
                string connectionString = _configuration.GetConnectionString("SqlConnection");

                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    string encryptedPassword = CommonMethods.ConvertToEncrypt(registration.Password);

                    string insertUserQuery = "INSERT INTO user_tbl (f_name, l_name, email, NIC, contact_no, address, password, permission) " +
                    "VALUES (@FName, @LName, @Email, @NIC, @Tel_No, @address, @Password, @Permission)";

                    using (SqlCommand cmd = new SqlCommand(insertUserQuery, con))
                    {
                        cmd.Parameters.AddWithValue("@FName", registration.FName);
                        cmd.Parameters.AddWithValue("@LName", registration.LName);
                        cmd.Parameters.AddWithValue("@Email", registration.Email);
                        cmd.Parameters.AddWithValue("@NIC", registration.NIC);
                        cmd.Parameters.AddWithValue("@Tel_No", registration.Tel_No);
                        cmd.Parameters.AddWithValue("@address", registration.address);
                        cmd.Parameters.AddWithValue("@Password", encryptedPassword);
                        cmd.Parameters.AddWithValue("@Permission", registration.Permission);

                        int jobSeekerRowsAffected = cmd.ExecuteNonQuery();

                        if (jobSeekerRowsAffected > 0)
                        {
                            response.StatusCode = 200;
                            response.StatusMessage = "Registration successful";
                        }
                        else
                        {
                            response.StatusCode = 100;
                            response.StatusMessage = "Registration failed";
                        }
                    }
                }


            }

            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

            return Ok(response);

        }

        [HttpGet]
        [Route("Users")]
        public IActionResult GetUsers()
        {
            string connectionString = _configuration.GetConnectionString("SqlConnection");
            List<GetUsers> users = new List<GetUsers>();

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                string query = "SELECT * FROM user_tbl";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            int Permission = Convert.ToInt32(reader["permission"]);
                            string Permission_Type = "";

                            if (Permission == 1)
                            {
                                Permission_Type = "Default User";
                            }
                            else if (Permission == 2)
                            {
                                Permission_Type = "Admin";
                            }


                            int Status = Convert.ToInt32(reader["Status"]);
                            string Status_Type = "";

                            if (Status == 1)
                            {
                                Status_Type = "Active";
                            }
                            else
                            {
                                Status_Type = "Deactive";
                            }


                            var user = new GetUsers
                            {
                                User_Id = Convert.ToInt32(reader["user_id"]),
                                UserName = reader["f_name"].ToString() + " " + reader["l_name"].ToString(),
                                Email = reader["email"].ToString(),
                                Permission = Convert.ToInt32(reader["permission"]),
                                Permission_Type = Permission_Type,
                                Status_Type = Status_Type,
                            };
                            users.Add(user);
                        }
                    }
                }
            }

            return Ok(users);
        }

        [HttpDelete]
        [Route("Users/{id}")]
        public IActionResult DeleteUsers(int id)
        {
            string connectionString = _configuration.GetConnectionString("SqlConnection");

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                string query = "UPDATE user_tbl SET status = 0, updated_date = CURRENT_TIMESTAMP WHERE user_id = @User_Id";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@User_Id", id);

                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok("User deleted successfully!");
                    }
                    else
                    {
                        return NotFound("User delete failed.");
                    }
                }
            }
        }



        [HttpPut]
        [Route("Users/{id}")]
        public IActionResult UpdateUsers(int id, UpdateUser user)
        {
            string connectionString = _configuration.GetConnectionString("SqlConnection");

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                string query = "UPDATE user_tbl SET email = @Email, permission = @Permission, updated_date = CURRENT_TIMESTAMP WHERE user_id  = @User_Id";


                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@User_Id", id);
                    cmd.Parameters.AddWithValue("@Email", user.Email);
                    cmd.Parameters.AddWithValue("@Permission", user.Permission);

                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok("User details updated successfully!");
                    }
                    else
                    {
                        return NotFound("User details update failed.");
                    }
                }
            }
        }
    }
}
