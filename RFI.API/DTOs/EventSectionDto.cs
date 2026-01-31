namespace RFI.API.DTOs;

public record EventSectionDto(
    int Id,
    string SectionType,
    string? Title,
    string Content,
    int OrderIndex
);