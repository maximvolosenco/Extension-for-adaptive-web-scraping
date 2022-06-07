namespace Adaptive.WebApi.DTO
{
    public class SelectorDataDTO
    {
        public string Email { get; set; }
        public List<string> AllowedDomains { get; set; }
        public string StartUrl { get; set; }
        public List<string> LinksToFollow { get; set; }
        public List<string> LinksToParse { get; set; }
        public Dictionary<string, string> Tags { get; set; }

    }
}
