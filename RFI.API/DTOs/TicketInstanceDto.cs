namespace RFI.API.DTOs;

// TicketInstanceDto.cs
public class TicketInstanceDto
{
    public int Id { get; set; }
    public required string TicketCode { get; set; }
    public bool IsUsed { get; set; }
    public DateTime? UsedAt { get; set; }
 }