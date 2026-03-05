using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.DTOs;
using RFI.API.Models;

namespace RFI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShopController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ShopController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("purchase")]
    public async Task<IActionResult> Purchase([FromBody] CreateTicketPurchaseDto dto)
    {
        // Validate event exists
        var eventItem = await _context.Events.FindAsync(dto.EventId);
        if (eventItem == null)
        {
            return NotFound(new { message = "Event not found" });
        }

        // Generate unique purchase code
        var purchaseCode = $"RFI-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";

        // Create purchase record
        var purchase = new TicketPurchase
        {
            PurchaseCode = purchaseCode,
            EventId = dto.EventId,
            BuyerName = dto.BuyerName,
            BuyerEmail = dto.BuyerEmail,
            BuyerPhone = dto.BuyerPhone,
            Quantity = dto.Quantity,
            TotalPrice = 0, // TODO: Calculate based on event ticket price
            PurchaseDate = DateTime.UtcNow,
            PaymentStatus = "Pending",
            Event = eventItem,
            Tickets = new List<TicketInstance>()
        };

        // Generate individual tickets
        for (int i = 0; i < dto.Quantity; i++)
        {
            var ticketCode = $"TKT-{purchaseCode}-{(i + 1):D3}";
            var ticket = new TicketInstance
            {
                TicketCode = ticketCode,
                IsUsed = false,
                Purchase = purchase
            };
            purchase.Tickets.Add(ticket);
        }

        // Save to database
        _context.TicketPurchases.Add(purchase);
        await _context.SaveChangesAsync();

        // Return response DTO
        var responseDto = new TicketPurchaseDto
        {
            Id = purchase.Id,
            PurchaseCode = purchase.PurchaseCode,
            EventId = purchase.EventId,
            EventTitle = eventItem.Title,
            BuyerName = purchase.BuyerName,
            BuyerEmail = purchase.BuyerEmail,
            Quantity = purchase.Quantity,
            TotalPrice = purchase.TotalPrice,
            PurchaseDate = purchase.PurchaseDate,
            PaymentStatus = purchase.PaymentStatus,
            Tickets = purchase.Tickets.Select(t => new TicketInstanceDto
            {
                Id = t.Id,
                TicketCode = t.TicketCode,
                IsUsed = t.IsUsed,
                UsedAt = t.UsedAt
            }).ToList()
        };

        return Ok(responseDto);
    }
}
