using Microsoft.AspNetCore.Authorization;
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

    // GET: api/shop/orders (user's orders - requires auth)
    [HttpGet("orders")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetMyOrders()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var orders = await _context.Orders
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .Include(o => o.Items)
                .ThenInclude(i => i.Event)
            .Include(o => o.Items)
                .ThenInclude(i => i.TicketInstances)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        var orderDtos = orders.Select(MapToDto);
        return Ok(orderDtos);
    }

    // GET: api/shop/orders/{orderNumber}
    [HttpGet("orders/{orderNumber}")]
    [AllowAnonymous]
    public async Task<ActionResult<OrderDto>> GetOrderByNumber(string orderNumber)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .Include(o => o.Items)
                .ThenInclude(i => i.Event)
            .Include(o => o.Items)
                .ThenInclude(i => i.TicketInstances)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);

        if (order == null)
            return NotFound(new { message = "Order not found" });

        return Ok(MapToDto(order));
    }

    // POST: api/shop/purchase
    [HttpPost("purchase")]
    [AllowAnonymous]
    public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderDto dto)
    {
        // Validate items
        if (dto.Items == null || !dto.Items.Any())
        {
            return BadRequest(new { message = "Order must contain at least one item" });
        }

        // Generate unique order number
        var orderNumber = $"RFI-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";

        var order = new Order
        {
            OrderNumber = orderNumber,
            CustomerName = dto.CustomerName,
            CustomerEmail = dto.CustomerEmail,
            CustomerPhone = dto.CustomerPhone,
            ShippingAddress = dto.ShippingAddress,
            ShippingCity = dto.ShippingCity,
            ShippingPostalCode = dto.ShippingPostalCode,
            ShippingCountry = dto.ShippingCountry,
            PaymentStatus = "Pending",
            OrderDate = DateTime.UtcNow,
            Items = new List<OrderItem>()
        };

        decimal subtotal = 0;
        bool requiresShipping = false;

        // Process each item
        foreach (var itemDto in dto.Items)
        {
            OrderItem orderItem;

            if (itemDto.ItemType == "Product")
            {
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                if (product == null)
                {
                    return BadRequest(new { message = $"Product with ID {itemDto.ProductId} not found" });
                }

                if (!product.IsActive)
                {
                    return BadRequest(new { message = $"Product {product.Name} is not available" });
                }

                if (product.StockQuantity < itemDto.Quantity)
                {
                    return BadRequest(new { message = $"Insufficient stock for {product.Name}" });
                }

                orderItem = new OrderItem
                {
                    ItemType = "Product",
                    ProductId = product.Id,
                    ItemName = product.Name,
                    UnitPrice = product.Price,
                    Quantity = itemDto.Quantity,
                    TotalPrice = product.Price * itemDto.Quantity,
                    Order = order
                };

                // Reduce stock
                product.StockQuantity -= itemDto.Quantity;

                if (product.RequiresShipping)
                {
                    requiresShipping = true;
                }

                subtotal += orderItem.TotalPrice;
            }
            else if (itemDto.ItemType == "EventTicket")
            {
                var eventItem = await _context.Events.FindAsync(itemDto.EventId);
                if (eventItem == null)
                {
                    return BadRequest(new { message = $"Event with ID {itemDto.EventId} not found" });
                }

                if (!eventItem.IsTicketSaleActive)
                {
                    return BadRequest(new { message = $"Ticket sales for {eventItem.Title} are not active" });
                }

                if (eventItem.TicketPrice == null)
                {
                    return BadRequest(new { message = $"Event {eventItem.Title} does not have ticket pricing" });
                }

                if (eventItem.AvailableTickets < itemDto.Quantity)
                {
                    return BadRequest(new { message = $"Insufficient tickets available for {eventItem.Title}" });
                }

                orderItem = new OrderItem
                {
                    ItemType = "EventTicket",
                    EventId = eventItem.Id,
                    ItemName = eventItem.Title,
                    UnitPrice = eventItem.TicketPrice.Value,
                    Quantity = itemDto.Quantity,
                    TotalPrice = eventItem.TicketPrice.Value * itemDto.Quantity,
                    Order = order,
                    TicketInstances = new List<TicketInstance>()
                };

                // Generate ticket instances
                for (int i = 0; i < itemDto.Quantity; i++)
                {
                    var ticketCode = $"TKT-{orderNumber}-{(order.Items.Count + 1):D2}-{(i + 1):D3}";
                    orderItem.TicketInstances.Add(new TicketInstance
                    {
                        TicketCode = ticketCode,
                        IsUsed = false,
                        OrderItem = orderItem
                    });
                }

                // Reduce available tickets
                eventItem.AvailableTickets -= itemDto.Quantity;

                subtotal += orderItem.TotalPrice;
            }
            else
            {
                return BadRequest(new { message = $"Invalid item type: {itemDto.ItemType}" });
            }

            order.Items.Add(orderItem);
        }

        // Calculate shipping (simple logic - can be enhanced)
        decimal shippingCost = 0;
        if (requiresShipping && !string.IsNullOrEmpty(dto.ShippingAddress))
        {
            shippingCost = 10.00m; // Flat rate shipping
        }

        order.SubtotalPrice = subtotal;
        order.ShippingCost = shippingCost;
        order.TotalPrice = subtotal + shippingCost;

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Reload with all relations
        var savedOrder = await _context.Orders
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .Include(o => o.Items)
                .ThenInclude(i => i.Event)
            .Include(o => o.Items)
                .ThenInclude(i => i.TicketInstances)
            .FirstAsync(o => o.Id == order.Id);

        return CreatedAtAction(nameof(GetOrderByNumber), new { orderNumber = savedOrder.OrderNumber }, MapToDto(savedOrder));
    }

    // PUT: api/shop/tickets/{ticketCode}/use (mark ticket as used)
    [HttpPut("tickets/{ticketCode}/use")]
    [Authorize]
    public async Task<IActionResult> UseTicket(string ticketCode)
    {
        var ticket = await _context.TicketInstances.FindAsync(ticketCode);
        
        if (ticket == null)
            return NotFound(new { message = "Ticket not found" });

        if (ticket.IsUsed)
            return BadRequest(new { message = "Ticket already used" });

        ticket.IsUsed = true;
        ticket.UsedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Ticket marked as used" });
    }

    private static OrderDto MapToDto(Order order)
    {
        return new OrderDto(
            order.Id,
            order.OrderNumber,
            order.CustomerName,
            order.CustomerEmail,
            order.CustomerPhone,
            order.SubtotalPrice,
            order.ShippingCost,
            order.TotalPrice,
            order.PaymentStatus,
            order.PaymentMethod,
            order.OrderDate,
            order.ShippingAddress,
            order.ShippingCity,
            order.ShippingPostalCode,
            order.ShippingCountry,
            order.TrackingNumber,
            order.Items.Select(i => new OrderItemDto(
                i.Id,
                i.ItemType,
                i.ItemName,
                i.UnitPrice,
                i.Quantity,
                i.TotalPrice,
                i.ProductId,
                i.EventId,
                i.TicketInstances?.Select(t => t.TicketCode).ToList()
            )).ToList()
        );
    }
}
