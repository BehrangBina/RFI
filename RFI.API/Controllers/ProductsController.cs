using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.DTOs;
using RFI.API.Models;

namespace RFI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/products (public)
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts([FromQuery] string? category = null)
    {
        var query = _context.Products
            .Where(p => p.IsActive)
            .AsQueryable();

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(p => p.Category.ToLower() == category.ToLower());
        }

        var products = await query
            .OrderBy(p => p.Category)
            .ThenBy(p => p.Name)
            .ToListAsync();

        var productDtos = products.Select(MapToDto);
        return Ok(productDtos);
    }

    // GET: api/products/{id}
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
            return NotFound();

        return Ok(MapToDto(product));
    }

    // GET: api/products/slug/{slug}
    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProductDto>> GetProductBySlug(string slug)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Slug == slug);

        if (product == null)
            return NotFound();

        return Ok(MapToDto(product));
    }

    // GET: api/products/categories
    [HttpGet("categories")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        var categories = await _context.Products
            .Where(p => p.IsActive)
            .Select(p => p.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }

    // POST: api/products
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto createDto)
    {
        var slug = GenerateSlug(createDto.Name);
        slug = await EnsureUniqueSlug(slug);

        var product = new Product
        {
            Name = createDto.Name,
            Slug = slug,
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

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, MapToDto(product));
    }

    // PUT: api/products/{id}
    [HttpPut("{id}")]
    [Authorize]
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
        product.RequiresShipping = updateDto.RequiresShipping;
        product.IsActive = updateDto.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/products/{id}
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        // Soft delete by marking as inactive
        product.IsActive = false;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/products/{id}/restore
    [HttpPost("{id}/restore")]
    [Authorize]
    public async Task<IActionResult> RestoreProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        product.IsActive = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT: api/products/{id}/stock
    [HttpPut("{id}/stock")]
    [Authorize]
    public async Task<IActionResult> UpdateStock(int id, [FromBody] int stockQuantity)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        product.StockQuantity = stockQuantity;
        product.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto(
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
    }

    private static string GenerateSlug(string name)
    {
        return name.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace("\"", "")
            .Replace("?", "")
            .Replace("!", "");
    }

    private async Task<string> EnsureUniqueSlug(string baseSlug)
    {
        var slug = baseSlug;
        var counter = 1;

        while (await _context.Products.AnyAsync(p => p.Slug == slug))
        {
            slug = $"{baseSlug}-{counter}";
            counter++;
        }

        return slug;
    }
}
