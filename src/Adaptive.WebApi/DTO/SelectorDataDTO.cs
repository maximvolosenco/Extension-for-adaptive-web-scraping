namespace Adaptive.WebApi.DTO
{
    public class SelectorDataDTO
    {
        public string allowed_domains { get; set; }
        public string start_url { get; set; }
        public string links_to_follow { get; set; }
        public string links_to_parse { get; set; }
        public Dictionary<string, string> tags { get; set; }

    }
}