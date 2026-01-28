using RFI.API.DTOs;
using RFI.API.Request;

namespace RFI.API.Services;

public interface IPosterService
{
    Task<IEnumerable<PosterDto>> GetAllPostersAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<PosterDto>> GetPostersByEventAsync(int eventId, CancellationToken cancellationToken = default);
    Task<PosterDto?> GetPosterByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<PosterDto> UploadPosterAsync(PosterUploadRequest request, CancellationToken cancellationToken = default);
    Task TrackDownloadAsync(int id, CancellationToken cancellationToken = default);
}
