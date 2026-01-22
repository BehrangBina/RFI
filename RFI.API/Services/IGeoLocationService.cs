namespace RFI.API.Services
{
    public interface IGeoLocationService
    {
        Task<(string Country, string City)> GetLocationAsync(string ipAddress);
    }
}
