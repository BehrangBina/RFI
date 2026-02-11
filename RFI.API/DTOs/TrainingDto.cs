namespace RFI.API.DTOs
{
    public class TrainingDto
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
        public DateTime CreatedAt { get; set; }
        public int SubjectCategoryId { get; set; }
        public string? SubjectCategoryName { get; set; }
    }
}
