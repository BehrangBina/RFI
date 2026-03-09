namespace RFI.API.Models;

public class OrganizationMembers
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Position { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? ImageUrl { get; set; }
    public string? Bio { get; set; }
    public int? ParentId { get; set; }

}
