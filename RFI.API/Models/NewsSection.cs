namespace RFI.API.Models
{
    public class NewsSection
    {
        public int Id { get; set; }
        public int NewsId { get; set; }
        public string SectionType { get; set; } = string.Empty; // "summary", "key_points", "support_request"
        public string? Title { get; set; }
        public int OrderIndex { get; set; }
        
        // Navigation properties
        public News News { get; set; } = null!;
        public ICollection<KeyPoint> KeyPoints { get; set; } = new List<KeyPoint>();
    }
}