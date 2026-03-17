using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.DTOs;
using RFI.API.Models;
using RFI.API.Services;

namespace RFI.API.Controllers
{
    [Route("api/carousel")]
    [ApiController]
    public class HeroSlidesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly ICloudinaryService _cloudinaryService;

        public HeroSlidesController(
            ApplicationDbContext context, 
            IWebHostEnvironment environment,
            ICloudinaryService cloudinaryService)
        {
            _context = context;
            _environment = environment;
            _cloudinaryService = cloudinaryService;
        }

        // GET: api/heroslides
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HeroSlide>>> GetHeroSlides()
        {
            return await _context.HeroSlides
                .Where(s => s.IsActive)
                .OrderBy(s => s.OrderIndex)
                .ToListAsync();
        }

        // GET: api/heroslides/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<HeroSlide>> GetHeroSlide(int id)
        {
            var slide = await _context.HeroSlides.FindAsync(id);

            if (slide == null)
                return NotFound();

            return slide;
        }

        // POST: api/carousel (with file upload)
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<HeroSlide>> CreateHeroSlide([FromForm] string? title, [FromForm] int order, [FromForm] IFormFile? photo)
        {
            if (photo == null || photo.Length == 0)
                return BadRequest("Photo is required");

            // Upload to Cloudinary
            var imageUrl = await _cloudinaryService.UploadImageAsync(photo, "carousel");

            var slide = new HeroSlide
            {
                Title = title ?? "",
                ImageUrl = imageUrl,
                OrderIndex = order,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.HeroSlides.Add(slide);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHeroSlide), new { id = slide.Id }, slide);
        }

        // PUT: api/carousel/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHeroSlide(int id, [FromBody] UpdateCarouselDto dto)
        {
            var slide = await _context.HeroSlides.FindAsync(id);
            if (slide == null)
                return NotFound();

            slide.Title = dto.Title ?? slide.Title;
            slide.OrderIndex = dto.Order;
            slide.IsActive = dto.IsActive;
            slide.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HeroSlideExists(id))
                    return NotFound();
                throw;
            }

            return Ok(slide);
        }

        // DELETE: api/heroslides/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHeroSlide(int id)
        {
            var slide = await _context.HeroSlides.FindAsync(id);
            if (slide == null)
                return NotFound();

            _context.HeroSlides.Remove(slide);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/heroslides/upload-image
        [Authorize]
        [HttpPost("upload-image")]
        public async Task<ActionResult<string>> UploadHeroImage([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            try
            {
                var imageUrl = await _cloudinaryService.UploadImageAsync(file, "carousel");
                return Ok(imageUrl);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Image upload failed: {ex.Message}");
            }
        }

        private bool HeroSlideExists(int id)
        {
            return _context.HeroSlides.Any(e => e.Id == id);
        }
    }
}