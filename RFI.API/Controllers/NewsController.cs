using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.DTOs;
using RFI.API.Models;

namespace RFI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/news
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewsDto>>> GetAllNews()
        {
            var newsList = await _context.News
                .Include(n => n.Sections)
                .ThenInclude(s => s.KeyPoints)
                .OrderByDescending(n => n.Date)
                .ToListAsync();

            var newsDtos = newsList.Select(MapToDto);
            return Ok(newsDtos);
        }

        // GET: api/news/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<NewsDto>> GetNews(int id)
        {
            var news = await _context.News
                .Include(n => n.Sections)
                .ThenInclude(s => s.KeyPoints)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (news == null)
                return NotFound();

            return Ok(MapToDto(news));
        }

        // POST: api/news
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<NewsDto>> CreateNews(CreateNewsDto createDto)
        {
            var news = new News
            {
                Title = createDto.Title,
                Slug = GenerateSlug(createDto.Title),
                Summary = createDto.Summary,
                Category = createDto.Category,
                Date = createDto.Date,
                ReadTimeMinutes = createDto.ReadTimeMinutes,
                VideoUrl = createDto.VideoUrl,
                ImageUrl = createDto.ImageUrl,
                CreatedAt = DateTime.UtcNow
            };

            // Add sections
            foreach (var sectionDto in createDto.Sections)
            {
                var section = new NewsSection
                {
                    SectionType = sectionDto.SectionType,
                    Title = sectionDto.Title,
                    OrderIndex = sectionDto.OrderIndex
                };

                // Add key points
                foreach (var keyPointDto in sectionDto.KeyPoints)
                {
                    section.KeyPoints.Add(new KeyPoint
                    {
                        Title = keyPointDto.Title,
                        Description = keyPointDto.Description,
                        OrderIndex = keyPointDto.OrderIndex
                    });
                }

                news.Sections.Add(section);
            }

            _context.News.Add(news);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNews), new { id = news.Id }, MapToDto(news));
        }

        // PUT: api/news/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNews(int id, CreateNewsDto updateDto)
        {
            var news = await _context.News
                .Include(n => n.Sections)
                .ThenInclude(s => s.KeyPoints)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (news == null)
                return NotFound();

            // Update properties
            news.Title = updateDto.Title;
            news.Slug = GenerateSlug(updateDto.Title);
            news.Summary = updateDto.Summary;
            news.Category = updateDto.Category;
            news.Date = updateDto.Date;
            news.ReadTimeMinutes = updateDto.ReadTimeMinutes;
            news.VideoUrl = updateDto.VideoUrl;
            news.ImageUrl = updateDto.ImageUrl;

            // Remove old sections
            _context.NewsSections.RemoveRange(news.Sections);

            // Add new sections
            news.Sections.Clear();
            foreach (var sectionDto in updateDto.Sections)
            {
                var section = new NewsSection
                {
                    SectionType = sectionDto.SectionType,
                    Title = sectionDto.Title,
                    OrderIndex = sectionDto.OrderIndex
                };

                foreach (var keyPointDto in sectionDto.KeyPoints)
                {
                    section.KeyPoints.Add(new KeyPoint
                    {
                        Title = keyPointDto.Title,
                        Description = keyPointDto.Description,
                        OrderIndex = keyPointDto.OrderIndex
                    });
                }

                news.Sections.Add(section);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/news/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNews(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null)
                return NotFound();

            _context.News.Remove(news);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static NewsDto MapToDto(News news)
        {
            return new NewsDto(
                news.Id,
                news.Title,
                news.Slug,
                news.Summary,
                news.Category,
                news.Date,
                news.ReadTimeMinutes,
                news.VideoUrl,
                news.ImageUrl,
                news.CreatedAt,
                news.Sections
                    .OrderBy(s => s.OrderIndex)
                    .Select(s => new NewsSectionDto(
                        s.Id,
                        s.SectionType,
                        s.Title,
                        s.OrderIndex,
                        s.KeyPoints
                            .OrderBy(kp => kp.OrderIndex)
                            .Select(kp => new KeyPointDto(kp.Id, kp.Title, kp.Description, kp.OrderIndex))
                            .ToList()
                    ))
                    .ToList()
            );
        }

        private static string GenerateSlug(string title)
        {
            return title.ToLowerInvariant()
                .Replace(" ", "-")
                .Replace("'", "")
                .Replace("\"", "");
        }
    }
}