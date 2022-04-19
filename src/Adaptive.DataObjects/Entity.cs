using System.ComponentModel.DataAnnotations;

namespace Adaptive.DataObjects
{
    public class Entity
    {
        [MaxLength(250)]
        public int ID { get; set; }
    }
}