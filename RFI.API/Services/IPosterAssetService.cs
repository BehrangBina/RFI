using Microsoft.AspNetCore.Http;

namespace RFI.API.Services;

public record StoredPosterAsset(string RelativeUrl, long Length);

public interface IPosterAssetService
{
    Task<StoredPosterAsset> SaveAsync(IFormFile file, string? subDirectory, CancellationToken cancellationToken = default);
}
