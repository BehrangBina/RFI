using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.Models;

namespace RFI.API.Repositories;

public class DonationRepository : Repository<Donation>, IDonationRepository
{
    public DonationRepository(EventsDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Donation>> GetRecentDonationsAsync(int count, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .OrderByDescending(d => d.DonatedAt)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    public async Task<decimal> GetTotalAmountAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.SumAsync(d => d.Amount, cancellationToken);
    }

    public async Task<int> GetTotalCountAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.CountAsync(cancellationToken);
    }
}
