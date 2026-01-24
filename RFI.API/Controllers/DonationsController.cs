using Microsoft.AspNetCore.Mvc;

namespace RFI.API.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using RFI.API.Data;
    using RFI.API.Models;
    using RFI.API.Request;

    [ApiController]
        [Route("api/[controller]")]
        public class DonationsController : ControllerBase
        {
            private readonly EventsDbContext _context;

            public DonationsController(EventsDbContext context)
            {
                _context = context;
            }

            // POST: api/donations
            [HttpPost]
            public async Task<ActionResult<Donation>> RecordDonation([FromBody] DonationRequest request)
            {
                var donation = new Donation
                {
                    DonorName = request.DonorName ?? "Anonymous",
                    Amount = request.Amount,
                    Currency = request.Currency ?? "USD",
                    PayPalTransactionId = request.PayPalTransactionId,
                    PayPalPayerId = request.PayPalPayerId,
                    Email = request.Email ?? string.Empty,
                    Message = request.Message ?? string.Empty,
                    DonatedAt = DateTime.UtcNow
                };

                _context.Donations.Add(donation);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDonation), new { id = donation.Id }, donation);
            }

            // GET: api/donations/5
            [HttpGet("{id}")]
            public async Task<ActionResult<Donation>> GetDonation(int id)
            {
                var donation = await _context.Donations.FindAsync(id);

                if (donation == null)
                {
                    return NotFound();
                }

                return Ok(donation);
            }

            // GET: api/donations/stats
            [HttpGet("stats")]
            public async Task<ActionResult> GetDonationStats()
            {
                var totalDonations = await _context.Donations.CountAsync();
                var totalAmount = await _context.Donations.SumAsync(d => d.Amount);
                var averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;

                var recentDonations = await _context.Donations
                    .OrderByDescending(d => d.DonatedAt)
                    .Take(5)
                    .Select(d => new
                    {
                        d.DonorName,
                        d.Amount,
                        d.Currency,
                        d.Message,
                        d.DonatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    totalDonations,
                    totalAmount,
                    averageDonation,
                    recentDonations
                });
            }

            // GET: api/donations/recent
            [HttpGet("recent")]
            public async Task<ActionResult> GetRecentDonations(int count = 10)
            {
                var donations = await _context.Donations
                    .OrderByDescending(d => d.DonatedAt)
                    .Take(count)
                    .Select(d => new
                    {
                        d.Id,
                        d.DonorName,
                        d.Amount,
                        d.Currency,
                        d.Message,
                        d.DonatedAt
                    })
                    .ToListAsync();

                return Ok(donations);
            }
        }


    }

