namespace train_schedule_system_backend.Models
{
    public class Train
    {
        public string TrainName { get; set; }
        public string Created_by { get; set; }
    }

    public class GetTrain
    {
        public int TrainId{ get; set; }
        public string TrainName { get; set; }
        public string Status { get; set; }
    }

    public class UpdateTrain
    {
        public string TrainName { get; set; }

    }
}
