using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using train_schedule_system_backend.Common;
using train_schedule_system_backend.Models;

namespace train_schedule_system_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly IConfiguration _configuration;
        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        [Route("login")]
        public LoginResult Login(Login login)
        {
            string connectionString = _configuration.GetConnectionString("SqlConnection");
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();
                string encryptedPassword = CommonMethods.ConvertToEncrypt(login.Password);
                SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM user_tbl WHERE Email = '" + login.Email + "' AND Password = '" + encryptedPassword + "' AND Status = 1", con);
                DataTable dt = new DataTable();
                da.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    DataRow row = dt.Rows[0];
                    int userId = Convert.ToInt32(row["user_id"]);
                    string UserName = row["f_name"].ToString() + " " + row["l_name"].ToString();
                    string userEmail = row["email"].ToString();
                    int userPermission = Convert.ToInt32(row["permission"]);
                    int userStatus = Convert.ToInt32(row["status"]);

                    return new LoginResult
                    {
                        Id = userId,
                        UserName = UserName,
                        Email = userEmail,
                        Permission = userPermission,
                        Status = userStatus,
                        Token = CommonMethods.ConvertToEncrypt(userEmail),
                        Message = "Data Found"
                    };
                }
                else
                {
                    return new LoginResult
                    {
                        Message = "Invalid User"
                    };
                }
            }
        }
    }
}
