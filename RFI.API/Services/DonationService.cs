using RFI.API.DTOs;
using RFI.API.Models;
using RFI.API.Repositories;
using RFI.API.Request;

namespace RFI.API.Services;

public class DonationService : IDonationService
{
    private readonly IDonationRepository _donationRepository;

    public DonationService(IDonationRepository donationRepository)
    {
        _donationRepository = donationRepository;
    }

    public async Task<DonationDto> CreateDonationAsync(DonationRequest request, CancellationToken cancellationToken = default)
    {
        var donation = new Donation
        {
            DonorName = request.DonorName ?? "Anonymous",
            Amount = request.Amount,
            Currency = request.Currency ?? "USD",
            PayPalTransactionId = request.PayPalTransactionId,
            PayPalPayerId = request.PayPalPayerId,
            Email = request.Email ?? string.Empty,
            Message = request.Message ?? string.Empty,
            DonatedAt = DateTime.UtcNow
        };

        var created = await _donationRepository.AddAsync(donation, cancellationToken);
        return MapToDto(created);
    }

    public async Task<DonationDto?> GetDonationByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var donation = await _donationRepository.GetByIdAsync(id, cancellationToken);
        return donation != null ? MapToDto(donation) : null;
    }

    public async Task<DonationStatsDto> GetDonationStatsAsync(CancellationToken cancellationToken = default)
    {
        var totalCount = await _donationRepository.GetTotalCountAsync(cancellationToken);
        var totalAmount = await _donationRepository.GetTotalAmountAsync(cancellationToken);
        var averageDonation = totalCount > 0 ? totalAmount / totalCount : 0;
        
        var recentDonations = await _donationRepository.GetRecentDonationsAsync(5, cancellationToken);

        return new DonationStatsDto
        {
            TotalDonations = totalCount,
            TotalAmount = totalAmount,
            AverageDonation = averageDonation,
            RecentDonations = recentDonations.Select(MapToDto)
        };
    }

    public async Task<IEnumerable<DonationDto>> GetRecentDonationsAsync(int count, CancellationToken cancellationToken = default)
    {
        var donations = await _donationRepository.GetRecentDonationsAsync(count, cancellationToken);
        return donations.Select(MapToDto);
    }

    private static DonationDto MapToDto(Donation donation) => new()
    {
        Id = donation.Id,
        DonorName = donation.DonorName,
        Amount = donation.Amount,
        Currency = donation.Currency,
        Message = donation.Message,
        DonatedAt = donation.DonatedAt
    };
}
