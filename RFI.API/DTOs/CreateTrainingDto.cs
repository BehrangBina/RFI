namespace RFI.API.DTOs
{
    public class CreateTrainingDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Summary { get; set; }
        public string? VideoUrl { get; set; }
        public string? ImageUrl { get; set; }
        public int? ReadTimeMinutes { get; set; }
        public int OrderIndex { get; set; }
        public int SubjectCategoryId { get; set; }
    }
}
