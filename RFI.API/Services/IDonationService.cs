using RFI.API.DTOs;
using RFI.API.Request;

namespace RFI.API.Services;

public interface IDonationService
{
    Task<DonationDto> CreateDonationAsync(DonationRequest request, CancellationToken cancellationToken = default);
    Task<DonationDto?> GetDonationByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<DonationStatsDto> GetDonationStatsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<DonationDto>> GetRecentDonationsAsync(int count, CancellationToken cancellationToken = default);
}
