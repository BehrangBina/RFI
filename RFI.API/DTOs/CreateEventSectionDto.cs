namespace RFI.API.DTOs;

public record CreateEventSectionDto(
    string SectionType,
    string? Title,
    string Content,
    int OrderIndex
);