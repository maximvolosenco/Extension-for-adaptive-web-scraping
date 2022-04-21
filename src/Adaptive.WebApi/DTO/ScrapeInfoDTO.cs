namespace Adaptive.WebApi.DTO
{
    public class ScrapeInfoDTO
    {
        public UserDTO user { get; set; }
        public string Url { get; set; }
        public List<string> CssLinks { get; set; }

    }
}
