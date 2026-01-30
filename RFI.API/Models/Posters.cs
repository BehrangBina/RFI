namespace RFI.API.Models;

public class Poster
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string FileUrl { get; set; } = string.Empty; // Relative path or full URL
    public string? ThumbnailUrl { get; set; }
    public long FileSize { get; set; } // in bytes
    public int DownloadCount { get; set; } = 0;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public string? Tags { get; set; } // Comma-separated or JSON
}
