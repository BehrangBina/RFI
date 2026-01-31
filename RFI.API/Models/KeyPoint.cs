namespace RFI.API.Models
{
    public class KeyPoint
    {
        public int Id { get; set; }
        public int NewsSectionId { get; set; }
        public string? Title { get; set; }
        public string Description { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        
        // Navigation property
        public NewsSection NewsSection { get; set; } = null!;
    }
}