using Adaptive.Data.UnitOfWork;
using Adaptive.DataObjects;
using Adaptive.SMTP;
using Adaptive.WebApi.DTO;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace Adaptive.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ScraperController : BaseController
    {
        public ScraperController(IUnitOfWork database, IMapper mapper) : base(database, mapper) { }

        [HttpPost]
        public ActionResult PostScrapedData([FromBody] ScraperDataDTO scraperData)
        {
            if (scraperData.IsLastPackage)
            {
                // create file
                // send email

                ScrapeOrder scrapeOrder = _database.GetRepository<ScrapeOrder>().SingleOrDefault(order => order.ID == scraperData.ID);

                _database.GetRepository<ScrapeOrder>().Delete(scrapeOrder);
                _database.SaveChanges();

                return Ok();
            }

            // store into file 

            return Ok();
        }
    }
}
