using RFI.API.DTOs;
using RFI.API.Models;
using RFI.API.Repositories;
using RFI.API.Request;

namespace RFI.API.Services;

public class PosterService : IPosterService
{
    private readonly IPosterRepository _posterRepository;
    private readonly IEventRepository _eventRepository;
    private readonly IPosterAssetService _posterAssetService;

    public PosterService(
        IPosterRepository posterRepository, 
        IEventRepository eventRepository,
        IPosterAssetService posterAssetService)
    {
        _posterRepository = posterRepository;
        _eventRepository = eventRepository;
        _posterAssetService = posterAssetService;
    }

    public async Task<IEnumerable<PosterDto>> GetAllPostersAsync(CancellationToken cancellationToken = default)
    {
        var posters = await _posterRepository.GetAllAsync(cancellationToken);
        return posters.OrderByDescending(p => p.UploadedAt).Select(MapToDto);
    }

    public async Task<IEnumerable<PosterDto>> GetPostersByEventAsync(int eventId, CancellationToken cancellationToken = default)
    {
        var posters = await _posterRepository.GetByEventIdAsync(eventId, cancellationToken);
        return posters.Select(MapToDto);
    }

    public async Task<PosterDto?> GetPosterByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var poster = await _posterRepository.GetByIdAsync(id, cancellationToken);
        return poster != null ? MapToDto(poster) : null;
    }

    public async Task<PosterDto> UploadPosterAsync(PosterUploadRequest request, CancellationToken cancellationToken = default)
    {
        var eventExists = await _eventRepository.ExistsAsync(request.EventId, cancellationToken);
        if (!eventExists)
        {
            throw new InvalidOperationException($"Event with id {request.EventId} was not found.");
        }

        if (request.File == null || request.File.Length == 0)
        {
            throw new ArgumentException("Poster file is required.");
        }

        var posterAsset = await _posterAssetService.SaveAsync(request.File, request.EventId.ToString(), cancellationToken);

        string thumbnailUrl = string.Empty;
        if (request.Thumbnail is { Length: > 0 })
        {
            var thumbAsset = await _posterAssetService.SaveAsync(
                request.Thumbnail, 
                Path.Combine(request.EventId.ToString(), "thumbs"), 
                cancellationToken);
            thumbnailUrl = thumbAsset.RelativeUrl;
        }

        var poster = new Poster
        {
            EventId = request.EventId,
            Title = request.Title,
            FileUrl = posterAsset.RelativeUrl,
            ThumbnailUrl = thumbnailUrl,
            FileSize = posterAsset.Length,
            UploadedAt = DateTime.UtcNow
        };

        var created = await _posterRepository.AddAsync(poster, cancellationToken);
        return MapToDto(created);
    }

    public async Task TrackDownloadAsync(int id, CancellationToken cancellationToken = default)
    {
        await _posterRepository.IncrementDownloadCountAsync(id, cancellationToken);
    }

    private static PosterDto MapToDto(Poster poster) => new()
    {
        Id = poster.Id,
        EventId = poster.EventId,
        Title = poster.Title,
        FileUrl = poster.FileUrl,
        ThumbnailUrl = poster.ThumbnailUrl,
        FileSize = poster.FileSize,
        DownloadCount = poster.DownloadCount,
        UploadedAt = poster.UploadedAt
    };
}
