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
        private IConfiguration _configuration;

        public ScraperController(IUnitOfWork database, IMapper mapper, IConfiguration configuration) : base(database, mapper) 
        {
            _configuration = configuration;
        }

        [HttpPost]
        public ActionResult PostScrapedData([FromBody] GetScraperDataDTO scraperData)
        {

            if (scraperData.Data.Count > 0)
            {
                ScrapeOrder scrapeOrder = _database.GetRepository<ScrapeOrder>().SingleOrDefault(order => order.ID == scraperData.Id);
                if (scrapeOrder == null)
                    return NoContent();

                User user = _database.GetRepository<User>().SingleOrDefault(user => user.ID == scrapeOrder.UserID);
                if (user == null || user.Email == null)
                    return NoContent();

                string filePath = _configuration.GetSection("FilePath").Value;

                ContentModel content = new ContentModel
                {
                    FilePath = filePath,
                    Id = scraperData.Id,
                    IsFinalPackage = scraperData.IsFinalPackage,
                    Data = scraperData.Data,
                    RecipientMail = user.Email
                };

                ContentManager contentManager = new ContentManager();

                contentManager.CreateSendFile(content);
                return Ok();

            }
                
            //if (scraperData.IsFinalPackage)
            //{
            //    ScrapeOrder scrapeOrder = _database.GetRepository<ScrapeOrder>().SingleOrDefault(order => order.ID == scraperData.Id);

            //    _database.GetRepository<ScrapeOrder>().Delete(scrapeOrder);
            //    _database.SaveChanges();

            //    return Ok();
            //}


            return Ok();
        }
    }
}
