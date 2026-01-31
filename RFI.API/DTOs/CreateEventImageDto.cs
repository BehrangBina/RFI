namespace RFI.API.DTOs;

public record CreateEventImageDto(
    string ImageUrl,
    string? Caption,
    int OrderIndex
);
