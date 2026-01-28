using Microsoft.AspNetCore.Mvc;
using RFI.API.DTOs;
using RFI.API.Services;

namespace RFI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    // GET: api/analytics/by-country
    [HttpGet("by-country")]
    public async Task<ActionResult<IEnumerable<AnalyticsDto>>> GetVisitorsByCountry(
        CancellationToken cancellationToken)
    {
        var byCountry = await _analyticsService.GetVisitorsByCountryAsync(cancellationToken);
        return Ok(byCountry);
    }

    // GET: api/analytics/by-city
    [HttpGet("by-city")]
    public async Task<ActionResult<IEnumerable<CityAnalyticsDto>>> GetVisitorsByCity(
        CancellationToken cancellationToken)
    {
        var byCity = await _analyticsService.GetVisitorsByCityAsync(20, cancellationToken);
        return Ok(byCity);
    }
}
