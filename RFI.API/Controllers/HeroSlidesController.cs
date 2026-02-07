using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.Models;

namespace RFI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HeroSlidesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HeroSlidesController(ApplicationDbContext context)
        {
            _context = context;
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

        // POST: api/heroslides
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<HeroSlide>> CreateHeroSlide(HeroSlide slide)
        {
            slide.CreatedAt = DateTime.UtcNow;
            _context.HeroSlides.Add(slide);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHeroSlide), new { id = slide.Id }, slide);
        }

        // PUT: api/heroslides/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHeroSlide(int id, HeroSlide slide)
        {
            if (id != slide.Id)
                return BadRequest();

            slide.UpdatedAt = DateTime.UtcNow;
            _context.Entry(slide).State = EntityState.Modified;

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

            return NoContent();
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

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "highlights");
            Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok($"/highlights/{uniqueFileName}");
        }

        private bool HeroSlideExists(int id)
        {
            return _context.HeroSlides.Any(e => e.Id == id);
        }
    }
}