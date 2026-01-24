using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace RFI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : Controller
    {
        private EventsDbContext _context;
        public AnalyticsController(EventsDbContext context)
        {
            _context = context;
        }
        // GET: api/analytics/by-country
        [HttpGet("by-country")]
        public async Task<ActionResult> GetVisitorsByCountry()
        {


            var byCountry = await _context.Visitors
                .Where(v => v.Country != "Unknown")
                .GroupBy(v => v.Country)
                .Select(g => new
                {
                    country = g.Key,
                    visits = g.Count()
                })
                .OrderByDescending(c => c.visits)
                .ToListAsync();

            return Ok(byCountry);
        }
        // GET: api/analytics/by-city
        [HttpGet("by-city")]
        public async Task<ActionResult> GetVisitorsByCity()
        {
            var byCity = await _context.Visitors
                .Where(v => v.City != "Unknown")
                .GroupBy(v => new { v.City, v.Country })
                .Select(g => new
                {
                    city = g.Key.City,
                    country = g.Key.Country,
                    visits = g.Count()
                })
                .OrderByDescending(c => c.visits)
                .Take(20)
                .ToListAsync();

            return Ok(byCity);
        }

    }
 
}
