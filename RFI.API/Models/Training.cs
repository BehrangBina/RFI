namespace RFI.API.Models
{
    public class Training
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Summary { get; set; }
        public string? VideoUrl { get; set; }
        public string? ImageUrl { get; set; }
        public int? ReadTimeMinutes { get; set; }
        public int OrderIndex { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Foreign key
        public int SubjectCategoryId { get; set; }
        
        // Navigation properties
        public SubjectCategory SubjectCategory { get; set; } = null!;
    }
}
