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

            if (scraperData.Data.Count > 0)
            {
                //List<string> keys = new List<string>();

                foreach (var data in scraperData.Data)
                {
                    string smth = "";
                    foreach (var item in data.Values)
                    {
                        smth += item + ",";
                    }
                    return Ok(smth);
                }

            }
                
            if (scraperData.IsFinalPackage)
            {
                // create file
                // send email

                ScrapeOrder scrapeOrder = _database.GetRepository<ScrapeOrder>().SingleOrDefault(order => order.ID == scraperData.Id);

                _database.GetRepository<ScrapeOrder>().Delete(scrapeOrder);
                _database.SaveChanges();

                return Ok();
            }

            // store into file 

            return Ok();
        }
    }
}
