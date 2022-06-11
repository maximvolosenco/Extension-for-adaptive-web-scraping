using System.Net;
using System.Net.Mail;

namespace Adaptive.SMTP
{
    public class SMTPManager
    {
        public void SendEmail(string recipientMail, string filePath)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                //Credentials = new NetworkCredential("adaptive.webscraping@gmail.com", "adaptiveExtension123"),
                Credentials = new NetworkCredential("adaptive.webscraping@gmail.com", "npbedzietqxepzhg"),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("adaptive.webscraping@gmail.com"),
                Subject = "Scraped data",
                Body = $"Hello, \n\nBelow you will find attached the csv file with the data that was scraped with Adaptive Extension.",
            };

            mailMessage.To.Add(recipientMail);

            Attachment csvFile = new Attachment(filePath);
            mailMessage.Attachments.Add(csvFile);

            smtpClient.Send(mailMessage);
        }
    }
}