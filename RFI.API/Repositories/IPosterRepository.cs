using RFI.API.Models;

namespace RFI.API.Repositories;

public interface IPosterRepository : IRepository<Poster>
{
    Task<IEnumerable<Poster>> GetByEventIdAsync(int eventId, CancellationToken cancellationToken = default);
    Task IncrementDownloadCountAsync(int posterId, CancellationToken cancellationToken = default);
}
