using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.Models;

namespace RFI.API.Repositories;

public class VisitorRepository : Repository<Visitor>, IVisitorRepository
{
    public VisitorRepository(EventsDbContext context) : base(context)
    {
    }

    public async Task<Dictionary<string, int>> GetVisitorsByCountryAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(v => v.Country != "Unknown")
            .GroupBy(v => v.Country)
            .Select(g => new { Country = g.Key!, Count = g.Count() })
            .ToDictionaryAsync(x => x.Country, x => x.Count, cancellationToken);
    }

    public async Task<List<(string City, string Country, int Visits)>> GetVisitorsByCityAsync(int topCount, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(v => v.City != "Unknown")
            .GroupBy(v => new { v.City, v.Country })
            .Select(g => new { g.Key.City, g.Key.Country, Visits = g.Count() })
            .OrderByDescending(x => x.Visits)
            .Take(topCount)
            .Select(x => ValueTuple.Create(x.City!, x.Country!, x.Visits))
            .ToListAsync(cancellationToken);
    }
}
