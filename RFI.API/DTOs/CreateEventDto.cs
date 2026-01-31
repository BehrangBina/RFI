namespace RFI.API.DTOs;

public record CreateEventDto(
    string Title,
    DateTime Date,
    string? Location,
    string Category,
    string Summary,
    string? Description,
    int? AttendeeCount,
    string? VideoUrl,
    List<CreateEventImageDto> Images,
    List<CreateEventSectionDto> Sections
);
