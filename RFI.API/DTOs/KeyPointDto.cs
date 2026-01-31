namespace RFI.API.DTOs;

public record KeyPointDto(
    int Id,
    string? Title,
    string Description,
    int OrderIndex
);