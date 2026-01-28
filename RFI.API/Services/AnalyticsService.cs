using RFI.API.DTOs;
using RFI.API.Repositories;

namespace RFI.API.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly IVisitorRepository _visitorRepository;

    public AnalyticsService(IVisitorRepository visitorRepository)
    {
        _visitorRepository = visitorRepository;
    }

    public async Task<IEnumerable<AnalyticsDto>> GetVisitorsByCountryAsync(CancellationToken cancellationToken = default)
    {
        var byCountry = await _visitorRepository.GetVisitorsByCountryAsync(cancellationToken);
        
        return byCountry
            .OrderByDescending(x => x.Value)
            .Select(x => new AnalyticsDto { Country = x.Key, Visits = x.Value });
    }

    public async Task<IEnumerable<CityAnalyticsDto>> GetVisitorsByCityAsync(int topCount = 20, CancellationToken cancellationToken = default)
    {
        var byCity = await _visitorRepository.GetVisitorsByCityAsync(topCount, cancellationToken);
        
        return byCity.Select(x => new CityAnalyticsDto 
        { 
            City = x.City, 
            Country = x.Country, 
            Visits = x.Visits 
        });
    }
}
