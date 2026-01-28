using RFI.API.Models;

namespace RFI.API.Repositories;

public interface IDonationRepository : IRepository<Donation>
{
    Task<IEnumerable<Donation>> GetRecentDonationsAsync(int count, CancellationToken cancellationToken = default);
    Task<decimal> GetTotalAmountAsync(CancellationToken cancellationToken = default);
    Task<int> GetTotalCountAsync(CancellationToken cancellationToken = default);
}
