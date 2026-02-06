using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.DTOs;
using RFI.API.Models;

namespace RFI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AdminDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public AdminController(AdminDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet("carousel")]
        public async Task<IActionResult> GetCarouselPhotos()
        {
            var photos = await _context.CarouselPhotos
                .OrderBy(p => p.Order)
                .ToListAsync();
            return Ok(photos);
        }

        [HttpPost("carousel")]
        public async Task<IActionResult> AddCarouselPhoto([FromForm] CarouselPhotoDto dto)
        {
            if (dto.Photo == null || dto.Photo.Length == 0)
                return BadRequest("Photo is required");

            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "carousel");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Photo.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.Photo.CopyToAsync(stream);
            }

            var carouselPhoto = new CarouselPhoto
            {
                Title = dto.Title,
                ImageUrl = $"/uploads/carousel/{fileName}",
                Order = dto.Order,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.CarouselPhotos.Add(carouselPhoto);
            await _context.SaveChangesAsync();

            return Ok(carouselPhoto);
        }

        [HttpPut("carousel/{id}")]
        public async Task<IActionResult> UpdateCarouselPhoto(int id, [FromBody] UpdateCarouselDto dto)
        {
            var photo = await _context.CarouselPhotos.FindAsync(id);
            if (photo == null)
                return NotFound();

            photo.Title = dto.Title ?? photo.Title;
            photo.Order = dto.Order;
            photo.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();
            return Ok(photo);
        }

        [HttpDelete("carousel/{id}")]
        public async Task<IActionResult> DeleteCarouselPhoto(int id)
        {
            var photo = await _context.CarouselPhotos.FindAsync(id);
            if (photo == null)
                return NotFound();

            // Delete physical file
            var filePath = Path.Combine(_environment.WebRootPath, photo.ImageUrl.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);

            _context.CarouselPhotos.Remove(photo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
