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
    public class TrainingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TrainingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==================== SUBJECT CATEGORIES ====================

        // GET: api/training/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<SubjectCategoryDto>>> GetAllCategories()
        {
            var categories = await _context.SubjectCategories
                .Include(c => c.Trainings)
                .OrderBy(c => c.OrderIndex)
                .ToListAsync();

            var categoryDtos = categories.Select(c => new SubjectCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                OrderIndex = c.OrderIndex,
                CreatedAt = c.CreatedAt,
                TrainingCount = c.Trainings.Count
            });

            return Ok(categoryDtos);
        }

        // GET: api/training/categories/{id}
        [HttpGet("categories/{id}")]
        public async Task<ActionResult<SubjectCategoryDto>> GetCategory(int id)
        {
            var category = await _context.SubjectCategories
                .Include(c => c.Trainings)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return NotFound();

            var categoryDto = new SubjectCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
                ImageUrl = category.ImageUrl,
                OrderIndex = category.OrderIndex,
                CreatedAt = category.CreatedAt,
                TrainingCount = category.Trainings.Count,
                Trainings = category.Trainings
                    .OrderBy(t => t.OrderIndex)
                    .Select(t => new TrainingDto
                    {
                        Id = t.Id,
                        Title = t.Title,
                        Slug = t.Slug,
                        Content = t.Content,
                        Summary = t.Summary,
                        VideoUrl = t.VideoUrl,
                        ImageUrl = t.ImageUrl,
                        ReadTimeMinutes = t.ReadTimeMinutes,
                        OrderIndex = t.OrderIndex,
                        CreatedAt = t.CreatedAt,
                        SubjectCategoryId = t.SubjectCategoryId,
                        SubjectCategoryName = category.Name
                    })
                    .ToList()
            };

            return Ok(categoryDto);
        }

        // GET: api/training/categories/slug/{slug}
        [HttpGet("categories/slug/{slug}")]
        public async Task<ActionResult<SubjectCategoryDto>> GetCategoryBySlug(string slug)
        {
            var category = await _context.SubjectCategories
                .Include(c => c.Trainings)
                .FirstOrDefaultAsync(c => c.Slug == slug);

            if (category == null)
                return NotFound();

            var categoryDto = new SubjectCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
                ImageUrl = category.ImageUrl,
                OrderIndex = category.OrderIndex,
                CreatedAt = category.CreatedAt,
                TrainingCount = category.Trainings.Count,
                Trainings = category.Trainings
                    .OrderBy(t => t.OrderIndex)
                    .Select(t => new TrainingDto
                    {
                        Id = t.Id,
                        Title = t.Title,
                        Slug = t.Slug,
                        Content = t.Content,
                        Summary = t.Summary,
                        VideoUrl = t.VideoUrl,
                        ImageUrl = t.ImageUrl,
                        ReadTimeMinutes = t.ReadTimeMinutes,
                        OrderIndex = t.OrderIndex,
                        CreatedAt = t.CreatedAt,
                        SubjectCategoryId = t.SubjectCategoryId,
                        SubjectCategoryName = category.Name
                    })
                    .ToList()
            };

            return Ok(categoryDto);
        }

        // POST: api/training/categories
        [Authorize]
        [HttpPost("categories")]
        public async Task<ActionResult<SubjectCategoryDto>> CreateCategory(CreateSubjectCategoryDto createDto)
        {
            var category = new SubjectCategory
            {
                Name = createDto.Name,
                Slug = GenerateSlug(createDto.Name),
                Description = createDto.Description,
                ImageUrl = createDto.ImageUrl,
                OrderIndex = createDto.OrderIndex,
                CreatedAt = DateTime.UtcNow
            };

            _context.SubjectCategories.Add(category);
            await _context.SaveChangesAsync();

            var categoryDto = new SubjectCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
                ImageUrl = category.ImageUrl,
                OrderIndex = category.OrderIndex,
                CreatedAt = category.CreatedAt,
                TrainingCount = 0
            };

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, categoryDto);
        }

        // PUT: api/training/categories/{id}
        [Authorize]
        [HttpPut("categories/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, CreateSubjectCategoryDto updateDto)
        {
            var category = await _context.SubjectCategories.FindAsync(id);
            if (category == null)
                return NotFound();

            category.Name = updateDto.Name;
            category.Slug = GenerateSlug(updateDto.Name);
            category.Description = updateDto.Description;
            category.ImageUrl = updateDto.ImageUrl;
            category.OrderIndex = updateDto.OrderIndex;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/training/categories/{id}
        [Authorize]
        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.SubjectCategories.FindAsync(id);
            if (category == null)
                return NotFound();

            _context.SubjectCategories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ==================== TRAININGS ====================

        // GET: api/training
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrainingDto>>> GetAllTrainings()
        {
            var trainings = await _context.Trainings
                .Include(t => t.SubjectCategory)
                .OrderBy(t => t.SubjectCategoryId)
                .ThenBy(t => t.OrderIndex)
                .ToListAsync();

            var trainingDtos = trainings.Select(t => new TrainingDto
            {
                Id = t.Id,
                Title = t.Title,
                Slug = t.Slug,
                Content = t.Content,
                Summary = t.Summary,
                VideoUrl = t.VideoUrl,
                ImageUrl = t.ImageUrl,
                ReadTimeMinutes = t.ReadTimeMinutes,
                OrderIndex = t.OrderIndex,
                CreatedAt = t.CreatedAt,
                SubjectCategoryId = t.SubjectCategoryId,
                SubjectCategoryName = t.SubjectCategory.Name
            });

            return Ok(trainingDtos);
        }

        // GET: api/training/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TrainingDto>> GetTraining(int id)
        {
            var training = await _context.Trainings
                .Include(t => t.SubjectCategory)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (training == null)
                return NotFound();

            var trainingDto = new TrainingDto
            {
                Id = training.Id,
                Title = training.Title,
                Slug = training.Slug,
                Content = training.Content,
                Summary = training.Summary,
                VideoUrl = training.VideoUrl,
                ImageUrl = training.ImageUrl,
                ReadTimeMinutes = training.ReadTimeMinutes,
                OrderIndex = training.OrderIndex,
                CreatedAt = training.CreatedAt,
                SubjectCategoryId = training.SubjectCategoryId,
                SubjectCategoryName = training.SubjectCategory.Name
            };

            return Ok(trainingDto);
        }

        // GET: api/training/slug/{slug}
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<TrainingDto>> GetTrainingBySlug(string slug)
        {
            var training = await _context.Trainings
                .Include(t => t.SubjectCategory)
                .FirstOrDefaultAsync(t => t.Slug == slug);

            if (training == null)
                return NotFound();

            var trainingDto = new TrainingDto
            {
                Id = training.Id,
                Title = training.Title,
                Slug = training.Slug,
                Content = training.Content,
                Summary = training.Summary,
                VideoUrl = training.VideoUrl,
                ImageUrl = training.ImageUrl,
                ReadTimeMinutes = training.ReadTimeMinutes,
                OrderIndex = training.OrderIndex,
                CreatedAt = training.CreatedAt,
                SubjectCategoryId = training.SubjectCategoryId,
                SubjectCategoryName = training.SubjectCategory.Name
            };

            return Ok(trainingDto);
        }

        // GET: api/training/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<TrainingDto>>> GetTrainingsByCategory(int categoryId)
        {
            var category = await _context.SubjectCategories.FindAsync(categoryId);
            if (category == null)
                return NotFound();

            var trainings = await _context.Trainings
                .Include(t => t.SubjectCategory)
                .Where(t => t.SubjectCategoryId == categoryId)
                .OrderBy(t => t.OrderIndex)
                .ToListAsync();

            var trainingDtos = trainings.Select(t => new TrainingDto
            {
                Id = t.Id,
                Title = t.Title,
                Slug = t.Slug,
                Content = t.Content,
                Summary = t.Summary,
                VideoUrl = t.VideoUrl,
                ImageUrl = t.ImageUrl,
                ReadTimeMinutes = t.ReadTimeMinutes,
                OrderIndex = t.OrderIndex,
                CreatedAt = t.CreatedAt,
                SubjectCategoryId = t.SubjectCategoryId,
                SubjectCategoryName = t.SubjectCategory.Name
            });

            return Ok(trainingDtos);
        }

        // POST: api/training
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<TrainingDto>> CreateTraining(CreateTrainingDto createDto)
        {
            // Verify category exists
            var category = await _context.SubjectCategories.FindAsync(createDto.SubjectCategoryId);
            if (category == null)
                return BadRequest("Subject category not found");

            var training = new Training
            {
                Title = createDto.Title,
                Slug = GenerateSlug(createDto.Title),
                Content = createDto.Content,
                Summary = createDto.Summary,
                VideoUrl = createDto.VideoUrl,
                ImageUrl = createDto.ImageUrl,
                ReadTimeMinutes = createDto.ReadTimeMinutes,
                OrderIndex = createDto.OrderIndex,
                SubjectCategoryId = createDto.SubjectCategoryId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Trainings.Add(training);
            await _context.SaveChangesAsync();

            // Reload with category
            training = await _context.Trainings
                .Include(t => t.SubjectCategory)
                .FirstAsync(t => t.Id == training.Id);

            var trainingDto = new TrainingDto
            {
                Id = training.Id,
                Title = training.Title,
                Slug = training.Slug,
                Content = training.Content,
                Summary = training.Summary,
                VideoUrl = training.VideoUrl,
                ImageUrl = training.ImageUrl,
                ReadTimeMinutes = training.ReadTimeMinutes,
                OrderIndex = training.OrderIndex,
                CreatedAt = training.CreatedAt,
                SubjectCategoryId = training.SubjectCategoryId,
                SubjectCategoryName = training.SubjectCategory.Name
            };

            return CreatedAtAction(nameof(GetTraining), new { id = training.Id }, trainingDto);
        }

        // PUT: api/training/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTraining(int id, CreateTrainingDto updateDto)
        {
            var training = await _context.Trainings.FindAsync(id);
            if (training == null)
                return NotFound();

            // Verify category exists
            var category = await _context.SubjectCategories.FindAsync(updateDto.SubjectCategoryId);
            if (category == null)
                return BadRequest("Subject category not found");

            training.Title = updateDto.Title;
            training.Slug = GenerateSlug(updateDto.Title);
            training.Content = updateDto.Content;
            training.Summary = updateDto.Summary;
            training.VideoUrl = updateDto.VideoUrl;
            training.ImageUrl = updateDto.ImageUrl;
            training.ReadTimeMinutes = updateDto.ReadTimeMinutes;
            training.OrderIndex = updateDto.OrderIndex;
            training.SubjectCategoryId = updateDto.SubjectCategoryId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/training/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTraining(int id)
        {
            var training = await _context.Trainings.FindAsync(id);
            if (training == null)
                return NotFound();

            _context.Trainings.Remove(training);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ==================== HELPER METHODS ====================

        private static string GenerateSlug(string title)
        {
            return title.ToLowerInvariant()
                .Replace(" ", "-")
                .Replace("'", "")
                .Replace("\"", "")
                .Replace("?", "");
        }
    }
}
