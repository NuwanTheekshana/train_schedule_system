using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using train_schedule_system_backend.Models;

namespace train_schedule_system_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainController : Controller
    {
        private readonly IConfiguration _configuration;

        public TrainController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        [Route("AddTrain")]
        public IActionResult AddTrain(Train train)
        {
            Response response = new Response();

            try
            {
                string connectionString = _configuration.GetConnectionString("SqlConnection");

                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    string insertEventQuery = "INSERT INTO train_tbl (train_name, created_by) " +
                                                                 "VALUES (@TrainName, @Created_by)";

                    using (SqlCommand cmd = new SqlCommand(insertEventQuery, con))
                    {
                        cmd.Parameters.AddWithValue("@TrainName", train.TrainName);
                        cmd.Parameters.AddWithValue("@Created_by", train.Created_by);

                        int trainRowsAffected = cmd.ExecuteNonQuery();

                        if (trainRowsAffected > 0)
                        {
                            response.StatusCode = 200;
                            response.StatusMessage = "Train added successful";
                        }
                        else
                        {
                            response.StatusCode = 100;
                            response.StatusMessage = "Train added failed";
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
        [Route("Train")]
        public IActionResult GetTrain()
        {
            string connectionString = _configuration.GetConnectionString("SqlConnection");
            List<GetTrain> trains = new List<GetTrain>();

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    string query = "SELECT * FROM train_tbl WHERE status = 1";
                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int status = Convert.ToInt32(reader["status"]);
                                string statusType = status == 1 ? "Active" : "Deactive";

                                var trainlist = new GetTrain
                                {
                                    TrainId = Convert.ToInt32(reader["train_id"]),
                                    TrainName = Convert.ToString(reader["train_name"]),
                                    Status = statusType
                                };
                                trains.Add(trainlist);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }

            return Ok(trains);
        }


        [HttpPut]
        [Route("Train/{id}")]
        public IActionResult UpdateTrain(int id, UpdateTrain train)
        {
            string connectionString = _configuration.GetConnectionString("SqlConnection");

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                string query = "UPDATE train_tbl SET train_name = @TrainName WHERE train_id   = @TrainId ";


                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@TrainId", id);
                    cmd.Parameters.AddWithValue("@TrainName", train.TrainName);


                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok("Train details updated successfully!");
                    }
                    else
                    {
                        return NotFound("Train details update failed.");
                    }
                }
            }
        }



        [HttpDelete]
        [Route("Train/{id}")]
        public IActionResult DeleteTrain(int id)
        {
            string connectionString = _configuration.GetConnectionString("SqlConnection");

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                string query = "UPDATE train_tbl SET status = 0 WHERE train_id = @TrainId";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@TrainId", id);

                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok("Train deleted successfully!");
                    }
                    else
                    {
                        return NotFound("Train delete failed.");
                    }
                }
            }
        }



        [HttpGet]
        [Route("TrainList")]
        public IActionResult GetTrainLists()
        {
            string connectionString = _configuration.GetConnectionString("SqlConnection");
            List<GetTrainList> trainslists = new List<GetTrainList>();

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    string query = "SELECT train_id, train_name FROM train_tbl WHERE status = 1";
                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var trainlist = new GetTrainList
                                {
                                    TrainId = Convert.ToInt32(reader["train_id"]),
                                    TrainName = Convert.ToString(reader["train_name"]),
                                };
                                trainslists.Add(trainlist);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }

            return Ok(trainslists);
        }


    }
}
