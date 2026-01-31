namespace RFI.API.DTOs;

public record CreateKeyPointDto(
    string? Title,
    string Description,
    int OrderIndex
);
