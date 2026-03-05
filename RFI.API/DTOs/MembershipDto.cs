namespace RFI.API.DTOs;

public record MembershipDto
{
    public string? Name { get; init; }
    public required string Email { get; init; }
    public string? Phone { get; init; }
}
