namespace RFI.API.Models
{
    public class Poster
    {
        public int Id { get; set; }
        public int EventId { get; set; }  // Foreign key to Event
        public string Title { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public long FileSize { get; set; }  // in bytes
        public int DownloadCount { get; set; } = 0;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Event? Event { get; set; }
    }
}
