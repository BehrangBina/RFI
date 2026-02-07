using RFI.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.Models;

namespace RFI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetAllEvents([FromQuery] string? category = null)
        {
            var query = _context.Events
                .Include(e => e.Images)
                .Include(e => e.Sections)
                .AsQueryable();

            // Filter by category if provided
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(e => e.Category.ToLower() == category.ToLower());
            }

            var events = await query
                .OrderByDescending(e => e.Date)
                .ToListAsync();

            var eventDtos = events.Select(MapToDto);
            return Ok(eventDtos);
        }

        // GET: api/events/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<EventDto>> GetEvent(int id)
        {
            var eventEntity = await _context.Events
                .Include(e => e.Images)
                .Include(e => e.Sections)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (eventEntity == null)
                return NotFound();

            return Ok(MapToDto(eventEntity));
        }

        // GET: api/events/slug/{slug}
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<EventDto>> GetEventBySlug(string slug)
        {
            var eventEntity = await _context.Events
                .Include(e => e.Images)
                .Include(e => e.Sections)
                .FirstOrDefaultAsync(e => e.Slug == slug);

            if (eventEntity == null)
                return NotFound();

            return Ok(MapToDto(eventEntity));
        }

        // POST: api/events
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EventDto>> CreateEvent(CreateEventDto createDto)
        {
            var baseSlug = GenerateSlug(createDto.Title);
            var slug = await EnsureUniqueSlug(baseSlug);

            var eventEntity = new Event
            {
                Title = createDto.Title,
                Slug = slug,
                Date = createDto.Date,
                Location = createDto.Location,
                Category = createDto.Category.ToLower(),
                Summary = createDto.Summary,
                Description = createDto.Description,
                AttendeeCount = createDto.AttendeeCount,
                VideoUrl = createDto.VideoUrl,
                CreatedAt = DateTime.UtcNow
            };

            // Add images
            foreach (var imageDto in createDto.Images)
            {
                eventEntity.Images.Add(new EventImage
                {
                    ImageUrl = imageDto.ImageUrl,
                    Caption = imageDto.Caption,
                    OrderIndex = imageDto.OrderIndex
                });
            }

            // Add sections
            foreach (var sectionDto in createDto.Sections)
            {
                eventEntity.Sections.Add(new EventSection
                {
                    SectionType = sectionDto.SectionType,
                    Title = sectionDto.Title,
                    Content = sectionDto.Content,
                    OrderIndex = sectionDto.OrderIndex
                });
            }

            _context.Events.Add(eventEntity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = eventEntity.Id }, MapToDto(eventEntity));
        }

        // PUT: api/events/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, CreateEventDto updateDto)
        {
            var eventEntity = await _context.Events
                .Include(e => e.Images)
                .Include(e => e.Sections)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (eventEntity == null)
                return NotFound();

            // Update properties
            eventEntity.Title = updateDto.Title;
            eventEntity.Slug = GenerateSlug(updateDto.Title);
            eventEntity.Date = updateDto.Date;
            eventEntity.Location = updateDto.Location;
            eventEntity.Category = updateDto.Category.ToLower();
            eventEntity.Summary = updateDto.Summary;
            eventEntity.Description = updateDto.Description;
            eventEntity.AttendeeCount = updateDto.AttendeeCount;
            eventEntity.VideoUrl = updateDto.VideoUrl;

            // Remove old images and sections
            _context.EventImages.RemoveRange(eventEntity.Images);
            _context.EventSections.RemoveRange(eventEntity.Sections);

            // Add new images
            eventEntity.Images.Clear();
            foreach (var imageDto in updateDto.Images)
            {
                eventEntity.Images.Add(new EventImage
                {
                    ImageUrl = imageDto.ImageUrl,
                    Caption = imageDto.Caption,
                    OrderIndex = imageDto.OrderIndex
                });
            }

            // Add new sections
            eventEntity.Sections.Clear();
            foreach (var sectionDto in updateDto.Sections)
            {
                eventEntity.Sections.Add(new EventSection
                {
                    SectionType = sectionDto.SectionType,
                    Title = sectionDto.Title,
                    Content = sectionDto.Content,
                    OrderIndex = sectionDto.OrderIndex
                });
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/events/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var eventEntity = await _context.Events.FindAsync(id);
            if (eventEntity == null)
                return NotFound();

            _context.Events.Remove(eventEntity);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/events/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var categories = await _context.Events
                .Select(e => e.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }
        [Authorize]
        [HttpPost("upload-image")]
        public async Task<ActionResult<string>> UploadEventImage([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "events");
            Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok($"/uploads/events/{uniqueFileName}");
        }
        private static EventDto MapToDto(Event eventEntity)
        {
            return new EventDto(
                eventEntity.Id,
                eventEntity.Title,
                eventEntity.Slug,
                eventEntity.Date,
                eventEntity.Location,
                eventEntity.Category,
                eventEntity.Summary,
                eventEntity.Description,
                eventEntity.AttendeeCount,
                eventEntity.VideoUrl,
                eventEntity.CreatedAt,
                eventEntity.Images
                    .OrderBy(i => i.OrderIndex)
                    .Select(i => new EventImageDto(i.Id, i.ImageUrl, i.Caption, i.OrderIndex))
                    .ToList(),
                eventEntity.Sections
                    .OrderBy(s => s.OrderIndex)
                    .Select(s => new EventSectionDto(s.Id, s.SectionType, s.Title, s.Content, s.OrderIndex))
                    .ToList()
            );
        }

        private static string GenerateSlug(string title)
        {
            return title.ToLowerInvariant()
                .Replace(" ", "-")
                .Replace("'", "")
                .Replace("\"", "")
                .Replace(",", "")
                .Replace(":", "")
                .Replace("&", "and");
        }

        private async Task<string> EnsureUniqueSlug(string baseSlug)
        {
            var slug = baseSlug;
            var counter = 1;

            while (await _context.Events.AnyAsync(e => e.Slug == slug))
            {
                slug = $"{baseSlug}-{counter}";
                counter++;
            }

            return slug;
        }
    }
}