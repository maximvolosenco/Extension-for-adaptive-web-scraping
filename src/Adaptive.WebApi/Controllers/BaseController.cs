using Adaptive.Data.UnitOfWork;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace Adaptive.WebApi.Controllers
{
    public class BaseController : ControllerBase
    {
        protected readonly IUnitOfWork _database;
        protected readonly IMapper _mapper;

        public BaseController(IUnitOfWork database, IMapper mapper)
        {
            _database = database;
            _mapper = mapper;
        }
    }
}
