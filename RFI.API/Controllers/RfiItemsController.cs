using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.Models;

namespace RFI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RfiItemsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<RfiItemsController> _logger;

    public RfiItemsController(ApplicationDbContext context, ILogger<RfiItemsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all RFI items
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RfiItem>>> GetRfiItems()
    {
        return await _context.RfiItems.ToListAsync();
    }

    /// <summary>
    /// Get a specific RFI item by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<RfiItem>> GetRfiItem(int id)
    {
        var rfiItem = await _context.RfiItems.FindAsync(id);

        if (rfiItem == null)
        {
            return NotFound();
        }

        return rfiItem;
    }

    /// <summary>
    /// Create a new RFI item
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<RfiItem>> CreateRfiItem(RfiItem rfiItem)
    {
        _context.RfiItems.Add(rfiItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRfiItem), new { id = rfiItem.Id }, rfiItem);
    }

    /// <summary>
    /// Update an existing RFI item
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRfiItem(int id, RfiItem rfiItem)
    {
        if (id != rfiItem.Id)
        {
            return BadRequest();
        }

        _context.Entry(rfiItem).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!RfiItemExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    /// <summary>
    /// Delete an RFI item
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRfiItem(int id)
    {
        var rfiItem = await _context.RfiItems.FindAsync(id);
        if (rfiItem == null)
        {
            return NotFound();
        }

        _context.RfiItems.Remove(rfiItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool RfiItemExists(int id)
    {
        return _context.RfiItems.Any(e => e.Id == id);
    }
}
