namespace RFI.API.Models;

public class Order
{
    public int Id { get; set; }
    public required string OrderNumber { get; set; } // RFI-20260310-A1B2C3
    
    // Customer (can be guest or registered user)
    public int? UserId { get; set; }
    public User? User { get; set; }
    public required string CustomerName { get; set; }
    public required string CustomerEmail { get; set; }
    public string? CustomerPhone { get; set; }
    
    // Order details
    public decimal SubtotalPrice { get; set; }
    public decimal ShippingCost { get; set; } = 0;
    public decimal TotalPrice { get; set; }
    public required string PaymentStatus { get; set; } // Pending, Completed, Failed, Refunded
    public string? PaymentMethod { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    
    // Shipping (for physical products)
    public string? ShippingAddress { get; set; }
    public string? ShippingCity { get; set; }
    public string? ShippingPostalCode { get; set; }
    public string? ShippingCountry { get; set; }
    public string? TrackingNumber { get; set; }
    
    // Navigation
    public List<OrderItem> Items { get; set; } = new();
}
