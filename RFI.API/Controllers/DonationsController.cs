using Microsoft.AspNetCore.Mvc;
using RFI.API.DTOs;
using RFI.API.Request;
using RFI.API.Services;

namespace RFI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DonationsController : ControllerBase
{
    private readonly IDonationService _donationService;

    public DonationsController(IDonationService donationService)
    {
        _donationService = donationService;
    }

    // POST: api/donations
    [HttpPost]
    public async Task<ActionResult<DonationDto>> RecordDonation(
        [FromBody] DonationRequest request, 
        CancellationToken cancellationToken)
    {
        var donation = await _donationService.CreateDonationAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetDonation), new { id = donation.Id }, donation);
    }

    // GET: api/donations/5
    [HttpGet("{id}")]
    public async Task<ActionResult<DonationDto>> GetDonation(int id, CancellationToken cancellationToken)
    {
        var donation = await _donationService.GetDonationByIdAsync(id, cancellationToken);

        if (donation == null)
        {
            return NotFound();
        }

        return Ok(donation);
    }

    // GET: api/donations/stats
    [HttpGet("stats")]
    public async Task<ActionResult<DonationStatsDto>> GetDonationStats(CancellationToken cancellationToken)
    {
        var stats = await _donationService.GetDonationStatsAsync(cancellationToken);
        return Ok(stats);
    }

    // GET: api/donations/recent
    [HttpGet("recent")]
    public async Task<ActionResult<IEnumerable<DonationDto>>> GetRecentDonations(
        CancellationToken cancellationToken, 
        int count = 10)
    {
        var donations = await _donationService.GetRecentDonationsAsync(count, cancellationToken);
        return Ok(donations);
    }
}