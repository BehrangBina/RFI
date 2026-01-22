namespace RFI.API.Models
{
    public record Visitor
    {
        public int Id { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public string? Country { get; set; } = string.Empty;      
        public string? City { get; set; } = string.Empty;
        public DateTime VisitedAt { get; set; } = DateTime.UtcNow;
        public string? PageUrl { get; set; } = string.Empty;
        public string? UserAgent { get; set; } = string.Empty;
    }
}
