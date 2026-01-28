using RFI.API.Models;

namespace RFI.API.Services;

public interface IVisitorTrackingService
{
    Task TrackVisitorAsync(string ipAddress, string pageUrl, string userAgent, CancellationToken cancellationToken = default);
}
