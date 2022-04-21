using System.ComponentModel.DataAnnotations;

namespace Adaptive.DataObjects
{
    public class User : Entity
    {
        [MaxLength(250)]
        public string? Email { get; set; }
    }
}
