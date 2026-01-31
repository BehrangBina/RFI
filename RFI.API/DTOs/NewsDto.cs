namespace RFI.API.DTOs;

public record NewsDto(
    int Id,
    string Title,
    string Slug,
    string Summary,
    string? Category,
    DateTime Date,
    int? ReadTimeMinutes,
    string? VideoUrl,
    string? ImageUrl,
    DateTime CreatedAt,
    List<NewsSectionDto> Sections
);