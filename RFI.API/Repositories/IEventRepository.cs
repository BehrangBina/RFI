using RFI.API.Models;

namespace RFI.API.Repositories;

public interface IEventRepository : IRepository<Event>
{
    Task<IEnumerable<Event>> GetActiveEventsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Event>> GetUpcomingEventsAsync(CancellationToken cancellationToken = default);
}
