namespace RFI.API.DTOs
{
    public class SubjectCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int OrderIndex { get; set; }
        public DateTime CreatedAt { get; set; }
        public int TrainingCount { get; set; }
        public List<TrainingDto>? Trainings { get; set; }
    }
}
