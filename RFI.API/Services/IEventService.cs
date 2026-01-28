using RFI.API.DTOs;

namespace RFI.API.Services;

public interface IEventService
{
    Task<IEnumerable<EventDto>> GetAllEventsAsync(CancellationToken cancellationToken = default);
    Task<EventDto?> GetEventByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<EventDto>> GetUpcomingEventsAsync(CancellationToken cancellationToken = default);
}
