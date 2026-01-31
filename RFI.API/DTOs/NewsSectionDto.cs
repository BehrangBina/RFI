namespace RFI.API.DTOs;

public record NewsSectionDto(
    int Id,
    string SectionType,
    string? Title,
    int OrderIndex,
    List<KeyPointDto> KeyPoints
);