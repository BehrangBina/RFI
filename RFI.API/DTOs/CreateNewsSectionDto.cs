namespace RFI.API.DTOs;

public record CreateNewsSectionDto(
    string SectionType,
    string? Title,
    int OrderIndex,
    List<CreateKeyPointDto> KeyPoints
);
