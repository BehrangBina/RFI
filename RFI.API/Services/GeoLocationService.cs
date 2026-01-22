using System.Text.Json;

namespace RFI.API.Services
{
    public class GeoLocationService : IGeoLocationService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<GeoLocationService> _logger;

        public GeoLocationService(HttpClient httpClient, ILogger<GeoLocationService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<(string Country, string City)> GetLocationAsync(string ipAddress)
        {
            // Don't lookup localhost or private IPs
            if (string.IsNullOrEmpty(ipAddress) ||
                ipAddress == "unknown" ||
                ipAddress.StartsWith("127.") ||
                ipAddress.StartsWith("192.168.") ||
                ipAddress == "::1")
            {
                return ("Unknown", "Unknown");
            }

            try
            {
                // Using ipapi.co free service (1000 requests/day)
                var response = await _httpClient.GetAsync($"https://ipapi.co/{ipAddress}/json/");

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"Geolocation API failed for IP: {ipAddress}");
                    return ("Unknown", "Unknown");
                }

                var json = await response.Content.ReadAsStringAsync();
                var data = JsonSerializer.Deserialize<GeoLocationResponse>(json);

                return (data?.country_name ?? "Unknown", data?.city ?? "Unknown");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting geolocation for IP: {ipAddress}");
                return ("Unknown", "Unknown");
            }
        }
    }
}
