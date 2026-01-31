namespace RFI.API.DTOs;

public record EventImageDto(
    int Id,
    string ImageUrl,
    string? Caption,
    int OrderIndex
);
