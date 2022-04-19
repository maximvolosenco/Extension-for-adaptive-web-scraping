using Adaptive.Data.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace Adaptive.WebApi.Controllers
{
    public class BaseController : ControllerBase
    {
        protected readonly IUnitOfWork _database;

        public BaseController(IUnitOfWork database)
        {
            _database = database;
        }
    }
}
