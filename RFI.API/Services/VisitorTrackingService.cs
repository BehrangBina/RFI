using RFI.API.Models;
using RFI.API.Repositories;

namespace RFI.API.Services;

public class VisitorTrackingService : IVisitorTrackingService
{
    private readonly IVisitorRepository _visitorRepository;
    private readonly IGeoLocationService _geoLocationService;

    public VisitorTrackingService(
        IVisitorRepository visitorRepository,
        IGeoLocationService geoLocationService)
    {
        _visitorRepository = visitorRepository;
        _geoLocationService = geoLocationService;
    }

    public async Task TrackVisitorAsync(
        string ipAddress, 
        string pageUrl, 
        string userAgent, 
        CancellationToken cancellationToken = default)
    {
        var (country, city) = await _geoLocationService.GetLocationAsync(ipAddress);

        var visitor = new Visitor
        {
            IpAddress = ipAddress,
            Country = country,
            City = city,
            PageUrl = pageUrl,
            UserAgent = userAgent,
            VisitedAt = DateTime.UtcNow
        };

        await _visitorRepository.AddAsync(visitor, cancellationToken);
    }
}
