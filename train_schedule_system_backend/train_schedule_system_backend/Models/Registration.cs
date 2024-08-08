namespace train_schedule_system_backend.Models
{
    public class Registration
    {
        public string FName { get; set; }
        public string LName { get; set; }
        public string Email { get; set; }
        public string NIC { get; set; }
        public int Tel_No { get; set; }
        public string address { get; set; }
        public string Password { get; set; }
        public int Permission { get; set; }
    }
    
    public class GetUsers
    {
        public int User_Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public int Permission { get; set; }
        public string Permission_Type { get; set; }
        public string Status_Type { get; set; }
        public int Status { get; set; }

    }

    public class UpdateUser
    {
        public string Email { get; set; }
        public int Permission { get; set; }
    }
}
