namespace RFI.API.DTOs;

public record PosterDto
{
    public int Id { get; init; }
    public int EventId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string FileUrl { get; init; } = string.Empty;
    public string ThumbnailUrl { get; init; } = string.Empty;
    public long FileSize { get; init; }
    public int DownloadCount { get; init; }
    public DateTime UploadedAt { get; init; }
}
