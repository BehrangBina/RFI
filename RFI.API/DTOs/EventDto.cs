namespace RFI.API.DTOs;

public record EventDto(
    int Id,
    string Title,
    string Slug,
    DateTime Date,
    string? Location,
    string Category,
    string Summary,
    string? Description,
    int? AttendeeCount,
    string? VideoUrl,
    DateTime CreatedAt,
    List<EventImageDto> Images,
    List<EventSectionDto> Sections
);
