using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.Models;

namespace RFI.API.Repositories;

public class PosterRepository : Repository<Poster>, IPosterRepository
{
    public PosterRepository(EventsDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Poster>> GetByEventIdAsync(int eventId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => p.EventId == eventId)
            .OrderBy(p => p.Title)
            .ToListAsync(cancellationToken);
    }

    public async Task IncrementDownloadCountAsync(int posterId, CancellationToken cancellationToken = default)
    {
        var poster = await GetByIdAsync(posterId, cancellationToken);
        if (poster != null)
        {
            poster.DownloadCount++;
            await UpdateAsync(poster, cancellationToken);
        }
    }
}
