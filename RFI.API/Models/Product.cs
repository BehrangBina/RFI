namespace RFI.API.Models;

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public string? Description { get; set; }
    public required string Category { get; set; } // Merchandise, Books, Membership, Digital, etc.
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; } = true;
    public bool RequiresShipping { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
