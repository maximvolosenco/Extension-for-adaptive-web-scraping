using Adaptive.Data.UnitOfWork;
using Adaptive.DataObjects;
using Adaptive.WebApi.DTO;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace Adaptive.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReviewController : BaseController
    {
        public ReviewController(IUnitOfWork database, IMapper mapper) : base(database, mapper) { }

        [HttpPost]
        public ActionResult<ReviewDTO> PostUserInfo([FromBody] ReviewDTO reviewDTO)
        {
            Review reviewToDb = new Review
            {
                Score = reviewDTO.Score,
                Description = reviewDTO.Description
            };

            _database.GetRepository<Review>().Insert(reviewToDb);
            _database.SaveChanges();

            Review review = _database.GetRepository<Review>()
                .SingleOrDefault(user => user.ID == reviewToDb.ID);

            if (review == null)
                return StatusCode(500);

            return Ok();
        }
    }
}
