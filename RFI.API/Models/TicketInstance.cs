namespace RFI.API.Models;

public class TicketInstance
{
    public int Id { get; set; }
    public int OrderItemId { get; set; }
    public required string TicketCode { get; set; } // Unique code for each ticket
    public bool IsUsed { get; set; }
    public DateTime? UsedAt { get; set; }    
    public required OrderItem OrderItem { get; set; }
}
