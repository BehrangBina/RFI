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
    public class AdminController : ControllerBase
    {
        private readonly AdminDbContext _context;
        private readonly ApplicationDbContext _appContext;
        private readonly IWebHostEnvironment _environment;

        public AdminController(AdminDbContext context, ApplicationDbContext appContext, IWebHostEnvironment environment)
        {
            _context = context;
            _appContext = appContext;
            _environment = environment;
        }

        // Carousel endpoints removed - now handled by /api/carousel (HeroSlidesController)
        [Authorize]
        [HttpGet("memberships")]
        public async Task<IActionResult> GetMemberships()
        {
            var memberships = await _appContext.Memberships
                .OrderByDescending(m => m.JoinDate)
                .ToListAsync();
            return Ok(memberships);
        }
    }
}
