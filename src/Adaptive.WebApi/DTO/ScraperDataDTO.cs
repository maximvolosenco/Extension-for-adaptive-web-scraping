namespace Adaptive.WebApi.DTO
{
    public class ScraperDataDTO
    {
        public int Id { get; set; }
        public bool IsFinalPackage { get; set; }
        public List<IDictionary<string, string>> Data { get; set; }
    }
}
