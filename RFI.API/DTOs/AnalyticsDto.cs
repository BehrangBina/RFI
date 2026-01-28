namespace RFI.API.DTOs;

public record AnalyticsDto
{
    public string Country { get; init; } = string.Empty;
    public int Visits { get; init; }
}

public record CityAnalyticsDto
{
    public string City { get; init; } = string.Empty;
    public string Country { get; init; } = string.Empty;
    public int Visits { get; init; }
}
