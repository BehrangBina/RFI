namespace RFI.API.Models
{
    public class News
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string? Category { get; set; }
        public DateTime Date { get; set; }
        public int? ReadTimeMinutes { get; set; }
        public string? VideoUrl { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public ICollection<NewsSection> Sections { get; set; } = new List<NewsSection>();
    }
}