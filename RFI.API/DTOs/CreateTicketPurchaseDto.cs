using System.ComponentModel.DataAnnotations;

namespace RFI.API.DTOs;

public class CreateTicketPurchaseDto
{
    [Required]
    public int EventId { get; set; }
    
    [Required, MaxLength(100)]
    public required string BuyerName { get; set; }
    
    [Required, EmailAddress]
    public required string BuyerEmail { get; set; }
    
    [Phone]
    public string? BuyerPhone { get; set; }
    
    [Required, Range(1, 10)]
    public int Quantity { get; set; }
}