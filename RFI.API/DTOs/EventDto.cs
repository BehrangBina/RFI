namespace RFI.API.DTOs;

public record EventDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public DateTime EventDate { get; init; }
    public string Location { get; init; } = string.Empty;
    public List<string> ImageUrls { get; init; } = new();
    public string DetailedContent { get; init; } = string.Empty;
    public bool IsActive { get; init; }
}
