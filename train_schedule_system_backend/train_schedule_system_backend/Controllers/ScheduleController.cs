using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using train_schedule_system_backend.Models;

namespace train_schedule_system_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : Controller
    {
        private readonly IConfiguration _configuration;
        public ScheduleController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        [HttpPost]
        [Route("AddTrainSchedule")]
        public IActionResult AddTrain(TrainSchedule schedule)
        {
            Response response = new Response();

            try
            {
                string connectionString = _configuration.GetConnectionString("SqlConnection");

                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    string insertEventQuery = "INSERT INTO train_schedule_tbl (train_id, start_datetime, end_datetime, [from], [to], availble_seat, ticket_price, created_by) " +
                                                                 "VALUES (@Train_id, @Startdatetime, @Enddatetime, @From, @To, @Availble_seat, @Ticket_price, @Created_by)";

                    using (SqlCommand cmd = new SqlCommand(insertEventQuery, con))
                    {
                        cmd.Parameters.AddWithValue("@Train_id", schedule.Train_id);
                        cmd.Parameters.AddWithValue("@Startdatetime", schedule.Startdatetime);
                        cmd.Parameters.AddWithValue("@Enddatetime", schedule.Enddatetime);
                        cmd.Parameters.AddWithValue("@From", schedule.DepartureLocation);
                        cmd.Parameters.AddWithValue("@To", schedule.ArrivalLocation);
                        cmd.Parameters.AddWithValue("@Availble_seat", schedule.Availble_seat);
                        cmd.Parameters.AddWithValue("@Ticket_price", schedule.Ticket_price);
                        cmd.Parameters.AddWithValue("@Created_by", schedule.Created_by);

                        int SheduleRowsAffected = cmd.ExecuteNonQuery();

                        if (SheduleRowsAffected > 0)
                        {
                            response.StatusCode = 200;
                            response.StatusMessage = "Train schedule added successful";
                        }
                        else
                        {
                            response.StatusCode = 100;
                            response.StatusMessage = "Train schedule added failed";
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
        [Route("TrainSchedule")]
        public IActionResult GetTrainSchedule()
        {
            string connectionString = _configuration.GetConnectionString("SqlConnection");
            List<GetTrainSchedule> trainschedule = new List<GetTrainSchedule>();

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    string query = "SELECT t.train_name, ts.* FROM train_schedule_tbl ts, train_tbl t WHERE ts.train_id = t.train_id and t.status = 1 and ts.status = 1";
                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int status = Convert.ToInt32(reader["status"]);
                                string statusType = status == 1 ? "Active" : "Deactive";

                                var trainschdulelist = new GetTrainSchedule
                                {
                                    TrainSchedule_id = Convert.ToInt32(reader["schedule_id"]),
                                    Train_name = Convert.ToString(reader["train_name"]),
                                    Startdatetime = Convert.ToDateTime(reader["start_datetime"]),
                                    Enddatetime = Convert.ToDateTime(reader["end_datetime"]),
                                    From = Convert.ToString(reader["from"]),
                                    To = Convert.ToString(reader["to"]),
                                    Availble_seat = Convert.ToInt32(reader["availble_seat"]),
                                    Ticket_price = Convert.ToDecimal(reader["ticket_price"]),
                                    Created_by = Convert.ToInt32(reader["created_by"]),
                                    Status = statusType
                                };
                                trainschedule.Add(trainschdulelist);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }

            return Ok(trainschedule);
        }


        [HttpPut]
        [Route("TrainSchdule/{id}")]
        public IActionResult UpdateTrain(int id, UpdateTrainSchedule trainschedule)
        {
            string connectionString = _configuration.GetConnectionString("SqlConnection");

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                string query = "UPDATE train_schedule_tbl SET [from] = @From, [to] = @To, availble_seat = @Avaible_Seat, ticket_price = @Ticket_Price WHERE schedule_id = @TrainScheduleId ";


                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@TrainScheduleId", id);
                    cmd.Parameters.AddWithValue("@From", trainschedule.DepartureLocation);
                    cmd.Parameters.AddWithValue("@To", trainschedule.ArrivalLocation);
                    cmd.Parameters.AddWithValue("@Avaible_Seat", trainschedule.Availble_seat);
                    cmd.Parameters.AddWithValue("@Ticket_Price", trainschedule.Ticket_Price);


                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok("Train schedule details updated successfully!");
                    }
                    else
                    {
                        return NotFound("Train schedule details update failed.");
                    }
                }
            }
        }

        [HttpDelete]
        [Route("TrainSchedule/{id}")]
        public IActionResult DeleteTrainSchedule(int id)
        {
            string connectionString = _configuration.GetConnectionString("SqlConnection");

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                string query = "UPDATE train_schedule_tbl SET status = 0 WHERE schedule_id = @SchduleTrainId";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@SchduleTrainId", id);

                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok("Train schedule deleted successfully!");
                    }
                    else
                    {
                        return NotFound("Train schedule delete failed.");
                    }
                }
            }
        }



        [HttpGet]
        [Route("ScheduleFromList")]
        public IActionResult ScheduleFromList()
        {
            string connectionString = _configuration.GetConnectionString("SqlConnection");
            List<ScheduleFromList> fromlists = new List<ScheduleFromList>();

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    string query = "SELECT distinct [from] FROM train_schedule_tbl WHERE status = 1";
                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var fromlist = new ScheduleFromList
                                {
                                    DepartureLocation = Convert.ToString(reader["from"]),
                                };
                                fromlists.Add(fromlist);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }

            return Ok(fromlists);
        }



        [HttpGet]
        [Route("ScheduleToList")]
        public IActionResult ScheduleToList()
        {
            string connectionString = _configuration.GetConnectionString("SqlConnection");
            List<ScheduleToList> tolists = new List<ScheduleToList>();

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    string query = "SELECT distinct [To] FROM train_schedule_tbl WHERE status = 1";
                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var tolist = new ScheduleToList
                                {
                                    ArrivalLocation = Convert.ToString(reader["to"]),
                                };
                                tolists.Add(tolist);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }

            return Ok(tolists);
        }


        [HttpGet]
        [Route("Find/GetTrainScheduleFindList/{FromDate}/{ToDate}/{From}/{To}")]
        public IActionResult GetTrainScheduleFindList(DateTime FromDate, DateTime ToDate, String From, String To)
        {
            string connectionString = _configuration.GetConnectionString("SqlConnection");
            List<GetTrainScheduleFindList> findlists = new List<GetTrainScheduleFindList>();

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    string query = "SELECT t.train_name, ts.* FROM train_schedule_tbl ts INNER JOIN train_tbl t ON ts.train_id = t.train_id WHERE t.status = 1 AND ts.status = 1 AND (CONVERT(date, ts.start_datetime) = @FromDate OR CONVERT(date, ts.end_datetime) = @ToDate) AND (ts.[from] = @From OR ts.[To] = @To);";
                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {

                        cmd.Parameters.AddWithValue("@FromDate", FromDate);
                        cmd.Parameters.AddWithValue("@ToDate", ToDate);
                        cmd.Parameters.AddWithValue("@From", From);
                        cmd.Parameters.AddWithValue("@To", To);



                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int status = Convert.ToInt32(reader["status"]);
                                string statusType = status == 1 ? "Active" : "Deactive";

                                var findlist = new GetTrainScheduleFindList
                                {
                                    TrainSchedule_id = Convert.ToInt32(reader["schedule_id"]),
                                    Train_name = Convert.ToString(reader["train_name"]),
                                    Startdatetime = Convert.ToDateTime(reader["start_datetime"]),
                                    Enddatetime = Convert.ToDateTime(reader["end_datetime"]),
                                    From = Convert.ToString(reader["from"]),
                                    To = Convert.ToString(reader["to"]),
                                    Availble_seat = Convert.ToInt32(reader["availble_seat"]),
                                    Ticket_price = Convert.ToDecimal(reader["ticket_price"]),
                                    Created_by = Convert.ToInt32(reader["created_by"]),
                                    Status = statusType
                                };
                                findlists.Add(findlist);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }

            return Ok(findlists);
        }


    }





}
