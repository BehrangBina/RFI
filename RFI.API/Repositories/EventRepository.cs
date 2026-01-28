using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.Models;

namespace RFI.API.Repositories;

public class EventRepository : Repository<Event>, IEventRepository
{
    public EventRepository(EventsDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Event>> GetActiveEventsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(e => e.IsActive)
            .OrderBy(e => e.EventDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetUpcomingEventsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(e => e.IsActive && e.EventDate >= DateTime.UtcNow)
            .OrderBy(e => e.EventDate)
            .ToListAsync(cancellationToken);
    }
}
