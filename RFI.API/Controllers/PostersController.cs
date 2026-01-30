using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.Models;

namespace RFI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;
    private readonly string _uploadsFolder;

    public PostersController(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
        _uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "posters");
        
        // Ensure upload directory exists
        if (!Directory.Exists(_uploadsFolder))
            Directory.CreateDirectory(_uploadsFolder);
    }

    // GET: api/posters
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Poster>>> GetPosters()
    {
        return await _context.Posters.ToListAsync();
    }

    // GET: api/posters/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Poster>> GetPoster(int id)
    {
        var poster = await _context.Posters.FindAsync(id);

        if (poster == null)
            return NotFound();

        return poster;
    }

    // POST: api/posters/upload
    [HttpPost("upload")]
    public async Task<ActionResult<Poster>> UploadPoster([FromForm] IFormFile file, [FromForm] string title, [FromForm] string? description)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        // Validate file size (20MB max)
        if (file.Length > 20 * 1024 * 1024)
            return BadRequest("File size exceeds 20MB limit");

        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".pdf" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
            return BadRequest("Invalid file type. Allowed: jpg, jpeg, png, gif, pdf");

        // Generate unique filename
        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(_uploadsFolder, fileName);

        // Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Create poster record
        var poster = new Poster
        {
            Title = title,
            Description = description,
            FileUrl = $"/uploads/posters/{fileName}",
            FileSize = file.Length,
            UploadedAt = DateTime.UtcNow
        };

        _context.Posters.Add(poster);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPoster), new { id = poster.Id }, poster);
    }

    // PUT: api/posters/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePoster(int id, [FromBody] Poster poster)
    {
        if (id != poster.Id)
            return BadRequest();

        _context.Entry(poster).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PosterExists(id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    // DELETE: api/posters/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePoster(int id)
    {
        var poster = await _context.Posters.FindAsync(id);
        if (poster == null)
            return NotFound();

        // Delete physical file
        var filePath = Path.Combine(_environment.WebRootPath, poster.FileUrl.TrimStart('/'));
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }

        _context.Posters.Remove(poster);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/posters/5/download
    [HttpPost("{id}/download")]
    public async Task<IActionResult> IncrementDownloadCount(int id)
    {
        var poster = await _context.Posters.FindAsync(id);
        if (poster == null)
            return NotFound();

        poster.DownloadCount++;
        await _context.SaveChangesAsync();

        return Ok(new { downloadCount = poster.DownloadCount });
    }

    private bool PosterExists(int id)
    {
        return _context.Posters.Any(e => e.Id == id);
    }
}
