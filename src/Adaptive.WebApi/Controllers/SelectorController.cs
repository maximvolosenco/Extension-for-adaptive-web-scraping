using Adaptive.Data.UnitOfWork;
using Adaptive.DataObjects;
using Adaptive.WebApi.DTO;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace Adaptive.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SelectorController : BaseController
    {
        public SelectorController(IUnitOfWork database, IMapper mapper) : base(database, mapper) {}

        [HttpPost]
        public ActionResult PostSelectorData([FromBody] SelectorDataDTO scrapeInfo)
        {
            User user = _database.GetRepository<User>()
                .SingleOrDefault(user => user.Email == scrapeInfo.Email);

            if (user == null)
            {
                User userToDb = new User
                {
                    Email = scrapeInfo.Email,
                };

                _database.GetRepository<User>().Insert(userToDb);
                _database.SaveChanges();

                user = _database.GetRepository<User>()
                .SingleOrDefault(user => user.ID == userToDb.ID);

                if (user == null)
                    return StatusCode(500);
            }

            ScrapeOrder scrapeOrderToDb = new ScrapeOrder 
            { 
                UserID = user.ID 
            };

            _database.GetRepository<ScrapeOrder>().Insert(scrapeOrderToDb);
            _database.SaveChanges();
            // call scraper service 


            return Ok();
        }
    }
}
