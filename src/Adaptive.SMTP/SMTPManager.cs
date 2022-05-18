using System.Net;
using System.Net.Mail;

namespace Adaptive.SMTP
{
    public class SMTPManager
    {


        public void SendEmail(string recipientMail, string scrapedSite)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("adaptive.webscraping@gmail.com", "adaptiveExtension123"),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("adaptive.webscraping@gmail.com"),
                Subject = "Scraped data from " + scrapedSite,
                Body = $"Hello, \n\nBelow you will find attached the csv file with the data that was scraped from '{scrapedSite}'.",
            };

            mailMessage.To.Add(recipientMail);

            smtpClient.Send(mailMessage);
        }
    }
}