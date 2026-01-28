namespace RFI.API.DTOs;

public record DonationDto
{
    public int Id { get; init; }
    public string DonorName { get; init; } = string.Empty;
    public decimal Amount { get; init; }
    public string Currency { get; init; } = "USD";
    public string Message { get; init; } = string.Empty;
    public DateTime DonatedAt { get; init; }
}

public record DonationStatsDto
{
    public int TotalDonations { get; init; }
    public decimal TotalAmount { get; init; }
    public decimal AverageDonation { get; init; }
    public IEnumerable<DonationDto> RecentDonations { get; init; } = new List<DonationDto>();
}
