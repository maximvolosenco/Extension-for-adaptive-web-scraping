
namespace Adaptive.SMTP
{
    public class CsvFileManager
    {
        private string _filePath;
        public CsvFileManager(string filePath)
        {
            _filePath = filePath;
        }

        public void CreateCsvFile(List<IDictionary<string, string>> data, bool isFinalPackage)
        {

            string fileContent = "";

            foreach (var dic in data)
            {
                fileContent += string.Join(",", dic.Values) + "\r";
            }

            try
            {

                WriteToFile(fileContent);

                if (isFinalPackage)
                {
                    fileContent = ReadFromFile();

                    ClearFile();

                    fileContent = string.Join(",", data[0].Keys) + "\r" + fileContent;

                    WriteToFile(fileContent);
                    // smtp send file
                }
             

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
           
        }
        
        private void WriteToFile(string content)
        {
            StreamWriter file = new StreamWriter(_filePath, true);

            file.Write(content);

            file.Close();
        }

        private string ReadFromFile()
        {
            StreamReader fileToRead = new StreamReader(_filePath);

            string? data = fileToRead.ReadToEnd();

            fileToRead.Close();

            return data;
        }

        private void ClearFile()
        {
            File.WriteAllBytes(_filePath, new byte[] { 0 });
        }
    }
}
