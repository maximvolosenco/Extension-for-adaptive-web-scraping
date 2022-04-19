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
        public ActionResult<List<UserDTO>> GetUserEmail()
        {
            var user = _database.GetRepository<User>()
                .GetList(selector: user => _mapper.Map<UserDTO>(user)).ToList();

            return user;
        }
        [HttpPost]
        //public ActionResult<UserDTO> PostUserInfo([FromBody] string email, string link, List<string> cssLinks)
        //{

        //}
    }
}
