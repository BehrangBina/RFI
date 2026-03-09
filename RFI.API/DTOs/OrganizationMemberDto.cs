namespace RFI.API.DTOs;

public record OrganizationMemberDto(
    int Id,
    string Name,
    string Position,
    string? Email,
    string? Phone,
    string? ImageUrl,
    string? Bio,
    int? ParentId,  // For hierarchy
    List<OrganizationMemberDto>? DirectReports  // For nested display
);
