namespace Adaptive.WebApi.DTO
{
    public class GetScraperDataDTO
    {
        public int Id { get; set; }
        public bool IsFinalPackage { get; set; }
        public List<IDictionary<string, string>> Data { get; set; }
    }
}
