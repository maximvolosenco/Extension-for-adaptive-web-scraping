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
    public class MailController : BaseController
    {
        public MailController(IUnitOfWork database, IMapper mapper) : base(database, mapper) { }

        [HttpPost]
        public void SendEmail([FromBody] string recipientMail)
        {
            string scrapedSite = "www.ebay.com";

            SMTPManager smtp = new SMTPManager();

            smtp.SendEmail(recipientMail,  scrapedSite);
        }
    }
}
