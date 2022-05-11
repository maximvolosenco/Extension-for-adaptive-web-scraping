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

        [HttpGet]
        public ActionResult<string> GetUserInfo()
        {

            return "this is response from back-end :D";
        }

        [HttpPost]
        public ActionResult<UserDTO> PostSelectorInfo([FromBody] SelectorInfoDTO scrapeInfo)
        {            
            User userToDb = new User
            {
                Email = scrapeInfo.Email,
            };

            _database.GetRepository<User>().Insert(userToDb);
            _database.SaveChanges();

            User user = _database.GetRepository<User>()
                .SingleOrDefault(user => user.ID == userToDb.ID);

            if (user == null)
                return StatusCode(500);

            // call scraper service 


            return Ok();
        }
    }
}
