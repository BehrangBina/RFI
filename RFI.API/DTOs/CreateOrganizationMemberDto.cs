namespace RFI.API.DTOs;

public record CreateOrganizationMemberDto(
    string Name,
    string Position,
    string? Email,
    string? Phone,
    string? ImageUrl,
    string? Bio,
    int? ParentId
);