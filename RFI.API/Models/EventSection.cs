namespace RFI.API.Models;

    public class EventSection
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string SectionType { get; set; } = string.Empty; // speech, outcomes, how_to_help, custom
        public string? Title { get; set; }
        public string Content { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        
        // Navigation property
        public Event Event { get; set; } = null!;
    }
