namespace RFI.API.Models;

    public class Event
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? Location { get; set; }
        public string Category { get; set; } = string.Empty; // vigil, rally, statement, solidarity
        public string Summary { get; set; } = string.Empty; // Short description for timeline card
        public string? Description { get; set; } // Full detailed description
        public int? AttendeeCount { get; set; }
        public string? VideoUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public ICollection<EventImage> Images { get; set; } = new List<EventImage>();
        public ICollection<EventSection> Sections { get; set; } = new List<EventSection>();
    }
