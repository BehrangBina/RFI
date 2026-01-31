namespace RFI.API.Models;

    public class EventImage
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
        public int OrderIndex { get; set; }
        
        // Navigation property
        public Event Event { get; set; } = null!;
    }
