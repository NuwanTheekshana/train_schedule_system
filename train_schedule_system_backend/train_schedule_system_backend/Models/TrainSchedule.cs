namespace train_schedule_system_backend.Models
{
    public class TrainSchedule
    {
        public int Train_id { get; set; }
        public DateTime Startdatetime { get; set; }
        public DateTime Enddatetime { get; set; }
        public String DepartureLocation { get; set; }
        public String ArrivalLocation { get; set; }
        public int Availble_seat { get; set; }
        public Decimal Ticket_price { get; set; }
        public int Created_by { get; set; }
    }


    public class GetTrainSchedule
    {
        public int TrainSchedule_id { get; set; }
        public string Train_name { get; set; }
        public DateTime Startdatetime { get; set; }
        public DateTime Enddatetime { get; set; }
        public String From { get; set; }
        public String To { get; set; }
        public int Availble_seat { get; set; }
        public Decimal Ticket_price { get; set; }
        public int Created_by { get; set; }
        public string Status { get; set; }
    }


    public class UpdateTrainSchedule
    {
        public string DepartureLocation { get; set; }
        public string ArrivalLocation { get; set; }
        public int Availble_seat { get; set; }
        public decimal Ticket_Price { get; set; }

    }

    public class ScheduleFromList
    {
        public string DepartureLocation { get; set; }

    }

    public class ScheduleToList
    {
        public string ArrivalLocation { get; set; }

    }


    public class GetTrainScheduleFindList
    {
        public int TrainSchedule_id { get; set; }
        public string Train_name { get; set; }
        public DateTime Startdatetime { get; set; }
        public DateTime Enddatetime { get; set; }
        public String From { get; set; }
        public String To { get; set; }
        public int Availble_seat { get; set; }
        public Decimal Ticket_price { get; set; }
        public int Created_by { get; set; }
        public string Status { get; set; }
    }


}
