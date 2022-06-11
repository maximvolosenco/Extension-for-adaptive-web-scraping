using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adaptive.SMTP
{
    public class ContentManager
    {
        public bool CreateSendFile(ContentModel contentModel)
        {
            string filePath = contentModel.FilePath + "\\" + contentModel.Id.ToString() + ".csv";

            try
            {
                CsvFileManager csvFileManager = new CsvFileManager(filePath);

                csvFileManager.CreateCsvFile(contentModel.Data, contentModel.IsFinalPackage);

                if (contentModel.IsFinalPackage)
                {
                    SMTPManager smtpManager = new SMTPManager();

                    smtpManager.SendEmail(contentModel.RecipientMail, filePath);
                }
                return true;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            

        }
    }
}
