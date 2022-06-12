using Adaptive.Data.UnitOfWork;
using Adaptive.DataObjects;
using Adaptive.WebApi.DTO;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace Adaptive.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SelectorController : BaseController
    {
        public SelectorController(IUnitOfWork database, IMapper mapper) : base(database, mapper) {}

        [HttpPost]
        public ActionResult PostSelectorData([FromBody] GetSelectorDataDTO scrapeInfo)
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

            PostSelectorDataDTO dataToScraper = new PostSelectorDataDTO
            {
                User_id = scrapeOrderToDb.ID.ToString(),
                Allowed_domains = scrapeInfo.Allowed_domains,
                Links_to_follow = scrapeInfo.Links_to_follow,
                Links_to_parse = scrapeInfo.Links_to_parse,
                Start_url = scrapeInfo.Start_url,
                Tags = scrapeInfo.Tags
            };

            var client = new HttpClient();

            var content = new StringContent(JsonSerializer.Serialize(dataToScraper), Encoding.UTF8, "application/json");

            var response = client.PostAsync("https:xyz", content).Result;




            return Ok(response);
        }
    }
}
