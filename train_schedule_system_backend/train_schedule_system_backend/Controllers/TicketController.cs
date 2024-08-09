using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using train_schedule_system_backend.Models;

namespace train_schedule_system_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : Controller
    {
        private readonly IConfiguration _configuration;
        public TicketController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        [Route("AddTicket")]
        public IActionResult AddTicket(Ticket ticket)
        {
            Response response = new Response();

            try
            {
                string connectionString = _configuration.GetConnectionString("SqlConnection");

                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    string checkSeatCountQuery = "SELECT ISNULL(SUM(seat_count), 0) FROM ticket_tbl " +
                                                 "WHERE schedule_id = @TrainSchedule_id AND user_id = @User_id and status = 1";

                    using (SqlCommand checkCmd = new SqlCommand(checkSeatCountQuery, con))
                    {
                        checkCmd.Parameters.AddWithValue("@TrainSchedule_id", ticket.TrainSchedule_id);
                        checkCmd.Parameters.AddWithValue("@User_id", ticket.User_id);

                        int currentSeatCount = (int)checkCmd.ExecuteScalar();

                        if (currentSeatCount + ticket.Seat_count > 5)
                        {
                            response.StatusCode = 400;
                            response.StatusMessage = "Available tickets limit exceeded.";
                            return BadRequest(response);
                        }
                    }

                    string insertEventQuery = "INSERT INTO ticket_tbl (schedule_id, seat_count, user_id) " +
                                                                 "VALUES (@TrainSchedule_id, @Seat_count, @User_id)";

                    using (SqlCommand cmd = new SqlCommand(insertEventQuery, con))
                    {
                        cmd.Parameters.AddWithValue("@TrainSchedule_id", ticket.TrainSchedule_id);
                        cmd.Parameters.AddWithValue("@Seat_count", ticket.Seat_count);
                        cmd.Parameters.AddWithValue("@User_id", ticket.User_id);

                        int TicketRowsAffected = cmd.ExecuteNonQuery();

                        if (TicketRowsAffected > 0)
                        {
                            response.StatusCode = 200;
                            response.StatusMessage = "Ticket added successfully";
                        }
                        else
                        {
                            response.StatusCode = 100;
                            response.StatusMessage = "Ticket added failed";
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




    }
}
