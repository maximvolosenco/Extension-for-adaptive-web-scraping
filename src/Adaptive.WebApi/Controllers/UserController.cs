using Adaptive.Data.UnitOfWork;
using Adaptive.DataObjects;
using Adaptive.WebApi.DTO;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace Adaptive.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : BaseController
    {
        public UserController(IUnitOfWork database, IMapper mapper) : base(database, mapper) {}

        [HttpGet]
        public ActionResult<string> GetUserInfo()
        {
            //var user = _database.GetRepository<User>()
            //    .GetList(selector: user => _mapper.Map<UserDTO>(user)).ToList();

            return "this is response from back-end :D";
        }

        [HttpPost]
        public ActionResult<UserDTO> PostUserInfo([FromBody] ScrapeInfoDTO scrapeInfo)
        {            
            User userToDb = new User
            {
                Email = scrapeInfo.user.Email,
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
