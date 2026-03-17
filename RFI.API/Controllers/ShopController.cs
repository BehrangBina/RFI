using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.DTOs;
using RFI.API.Models;
using RFI.API.Services;

namespace RFI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShopController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ICloudinaryService _cloudinaryService;

    public ShopController(ApplicationDbContext context, ICloudinaryService cloudinaryService)
    {
        _context = context;
        _cloudinaryService = cloudinaryService;
    }

    // ==================== PRODUCTS ====================

    // GET: api/shop/products
    [HttpGet("products")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts([FromQuery] bool? activeOnly = true)
    {
        var query = _context.Products.AsQueryable();

        if (activeOnly == true)
        {
            query = query.Where(p => p.IsActive);
        }

        var products = await query
            .OrderBy(p => p.Category)
            .ThenBy(p => p.Name)
            .ToListAsync();

        var productDtos = products.Select(p => new ProductDto(
            p.Id,
            p.Name,
            p.Slug,
            p.Description,
            p.Category,
            p.Price,
            p.ImageUrl,
            p.StockQuantity,
            p.IsActive,
            p.RequiresShipping,
            p.CreatedAt
        ));

        return Ok(productDtos);
    }

    // GET: api/shop/products/{id}
    [HttpGet("products/{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
            return NotFound();

        var productDto = new ProductDto(
            product.Id,
            product.Name,
            product.Slug,
            product.Description,
            product.Category,
            product.Price,
            product.ImageUrl,
            product.StockQuantity,
            product.IsActive,
            product.RequiresShipping,
            product.CreatedAt
        );

        return Ok(productDto);
    }

    // POST: api/shop/products
    [Authorize]
    [HttpPost("products")]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto createDto)
    {
        var product = new Product
        {
            Name = createDto.Name,
            Slug = GenerateSlug(createDto.Name),
            Description = createDto.Description,
            Category = createDto.Category,
            Price = createDto.Price,
            ImageUrl = createDto.ImageUrl,
            StockQuantity = createDto.StockQuantity,
            RequiresShipping = createDto.RequiresShipping,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        var productDto = new ProductDto(
            product.Id,
            product.Name,
            product.Slug,
            product.Description,
            product.Category,
            product.Price,
            product.ImageUrl,
            product.StockQuantity,
            product.IsActive,
            product.RequiresShipping,
            product.CreatedAt
        );

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
    }

    // PUT: api/shop/products/{id}
    [Authorize]
    [HttpPut("products/{id}")]
    public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto updateDto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        product.Name = updateDto.Name;
        product.Slug = GenerateSlug(updateDto.Name);
        product.Description = updateDto.Description;
        product.Category = updateDto.Category;
        product.Price = updateDto.Price;
        product.ImageUrl = updateDto.ImageUrl;
        product.StockQuantity = updateDto.StockQuantity;
        product.IsActive = updateDto.IsActive;
        product.RequiresShipping = updateDto.RequiresShipping;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/shop/products/{id}
    [Authorize]
    [HttpDelete("products/{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/shop/upload-image
    [HttpPost("upload-image")]
    public async Task<ActionResult<string>> UploadProductImage([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        try
        {
            var imageUrl = await _cloudinaryService.UploadImageAsync(file, "products");
            return Ok(imageUrl);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Image upload failed: {ex.Message}");
        }
    }

    // ==================== ORDERS ====================

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
            PaymentMethod = dto.PaymentMethod,
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

        // Calculate shipping (free shipping over $50, otherwise $5 flat rate)
        decimal shippingCost = 0;
        if (requiresShipping && !string.IsNullOrEmpty(dto.ShippingAddress))
        {
            shippingCost = subtotal > 50 ? 0 : 5.00m; // Free shipping over $50
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

    private static string GenerateSlug(string name)
    {
        return name.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace("\"", "")
            .Replace(",", "")
            .Replace(":", "")
            .Replace("&", "and");
    }
}
