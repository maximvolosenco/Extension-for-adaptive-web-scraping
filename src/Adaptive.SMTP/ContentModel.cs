namespace Adaptive.SMTP
{
    public class ContentModel
    {
        public string FilePath { get; set; }
        public int Id { get; set; }
        public bool IsFinalPackage { get; set; }
        public List<IDictionary<string, string>> Data { get; set; }
        public string RecipientMail { get; set; }
    }
}