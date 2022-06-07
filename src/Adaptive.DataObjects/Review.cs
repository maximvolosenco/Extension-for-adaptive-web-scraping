using System.ComponentModel.DataAnnotations;

namespace Adaptive.DataObjects
{
    public class Review : Entity
    {
        [MaxLength(2)]
        public int Score { get; set; }
        [MaxLength(1000)]
        public string Description { get; set; }
        public int UserID { get; set; }
    }
}
