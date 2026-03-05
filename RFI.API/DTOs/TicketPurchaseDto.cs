namespace RFI.API.DTOs;

public class TicketPurchaseDto
{
    public int Id { get; set; }
    public required string PurchaseCode { get; set; }
    public int EventId { get; set; }
    public required string EventTitle { get; set; }
    public required string BuyerName { get; set; }
    public required string BuyerEmail { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime PurchaseDate { get; set; }
    public required string PaymentStatus { get; set; }
    public required List<TicketInstanceDto> Tickets { get; set; }
}