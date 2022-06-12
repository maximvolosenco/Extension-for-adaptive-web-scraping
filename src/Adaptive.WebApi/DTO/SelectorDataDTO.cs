namespace Adaptive.WebApi.DTO
{
    public class SelectorDataDTO
    {
        public string Allowed_domains { get; set; }
        public string Start_url { get; set; }
        public string Links_to_follow { get; set; }
        public string Links_to_parse { get; set; }
        public Dictionary<string, string> Tags { get; set; }

    }
}
