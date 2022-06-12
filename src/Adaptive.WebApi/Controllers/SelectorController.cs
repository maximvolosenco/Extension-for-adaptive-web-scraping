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
                .SingleOrDefault(user => user.Email == scrapeInfo.email);

            if (user == null)
            {
                User userToDb = new User
                {
                    Email = scrapeInfo.email,
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
                user_id = scrapeOrderToDb.ID.ToString(),
                allowed_domains = scrapeInfo.allowed_domains,
                links_to_follow = scrapeInfo.links_to_follow,
                links_to_parse = scrapeInfo.links_to_parse,
                start_url = scrapeInfo.start_url,
                tags = scrapeInfo.tags
            };

            var client = new HttpClient();

            var content = new StringContent(JsonSerializer.Serialize(dataToScraper), Encoding.UTF8, "application/json");

            try
            {
                var response = client.PostAsync("http://localhost:8080/send_data", content);
                Console.WriteLine(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }




            return Ok();
        }
    }
}
