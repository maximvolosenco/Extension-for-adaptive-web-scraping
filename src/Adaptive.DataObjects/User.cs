using System.ComponentModel.DataAnnotations;

namespace Adaptive.DataObjects
{
    public class User : Entity
    {
        [MaxLength(250)]
        public string? Email { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<ScrapeOrder> ScrapeOrders { get; set; }
    }
}
