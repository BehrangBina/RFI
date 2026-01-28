using RFI.API.DTOs;

namespace RFI.API.Services;

public interface IAnalyticsService
{
    Task<IEnumerable<AnalyticsDto>> GetVisitorsByCountryAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<CityAnalyticsDto>> GetVisitorsByCityAsync(int topCount = 20, CancellationToken cancellationToken = default);
}
