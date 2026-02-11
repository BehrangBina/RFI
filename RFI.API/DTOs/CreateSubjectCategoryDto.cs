namespace RFI.API.DTOs
{
    public class CreateSubjectCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int OrderIndex { get; set; }
    }
}
