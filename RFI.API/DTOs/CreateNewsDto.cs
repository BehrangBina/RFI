namespace RFI.API.DTOs;

public record CreateNewsDto(
    string Title,
    string Summary,
    string? Category,
    DateTime Date,
    int? ReadTimeMinutes,
    string? VideoUrl,
    string? ImageUrl,
    List<CreateNewsSectionDto> Sections
);

