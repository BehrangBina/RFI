namespace RFI.API.Models;

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public required Order Order { get; set; }
    
    public required string ItemType { get; set; } // "Product" or "EventTicket"
    
    // Reference to product or event
    public int? ProductId { get; set; }
    public Product? Product { get; set; }
    
    public int? EventId { get; set; }
    public Event? Event { get; set; }
    
    // Item details (snapshot at purchase time)
    public required string ItemName { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
    
    // For tickets: individual ticket codes
    public List<TicketInstance>? TicketInstances { get; set; }
}
