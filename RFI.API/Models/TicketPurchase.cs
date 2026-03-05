namespace RFI.API.Models;

public class TicketPurchase
{
    public int Id { get; set; }
    public required string PurchaseCode { get; set; } // e.g., "RFI-2026-001234"
    public int EventId { get; set; }
    
    // Buyer Info (no registration needed)
    public required string BuyerName { get; set; }
    public required string BuyerEmail { get; set; }
    public string? BuyerPhone { get; set; }
    
    // Purchase Details
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime PurchaseDate { get; set; }
    public required string PaymentStatus { get; set; } // "Pending", "Completed", "Failed"
    
    // Relations
    public required Event Event { get; set; }
    public required List<TicketInstance> Tickets { get; set; }
}
