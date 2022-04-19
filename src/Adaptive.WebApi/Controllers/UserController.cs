using Adaptive.Data.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace Adaptive.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : BaseController
    {
        public UserController(IUnitOfWork database) : base(database){}

        [HttpGet]
        public ActionResult<string> GetUserEmail()
        {

            return "ameno";
        }
    }
}
