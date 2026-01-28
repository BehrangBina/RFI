using Microsoft.AspNetCore.Mvc;
using RFI.API.DTOs;
using RFI.API.Request;
using RFI.API.Services;

namespace RFI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostersController : ControllerBase
{
    private readonly IPosterService _posterService;

    public PostersController(IPosterService posterService)
    {
        _posterService = posterService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PosterDto>>> GetPosters(CancellationToken cancellationToken)
    {
        var posters = await _posterService.GetAllPostersAsync(cancellationToken);
        return Ok(posters);
    }

    // GET: api/posters/event/1
    [HttpGet("event/{eventId}")]
    public async Task<ActionResult<IEnumerable<PosterDto>>> GetPostersByEvent(
        int eventId, 
        CancellationToken cancellationToken)
    {
        var posters = await _posterService.GetPostersByEventAsync(eventId, cancellationToken);
        return Ok(posters);
    }

    // GET: api/posters/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PosterDto>> GetPoster(int id, CancellationToken cancellationToken)
    {
        var poster = await _posterService.GetPosterByIdAsync(id, cancellationToken);

        if (poster == null)
        {
            return NotFound();
        }

        return Ok(poster);
    }

    // POST: api/posters
    [HttpPost]
    [RequestSizeLimit(60_000_000)]
    public async Task<ActionResult<PosterDto>> UploadPoster(
        [FromForm] PosterUploadRequest request, 
        CancellationToken cancellationToken)
    {
        try
        {
            var poster = await _posterService.UploadPosterAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetPoster), new { id = poster.Id }, poster);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // POST: api/posters/5/download
    [HttpPost("{id}/download")]
    public async Task<ActionResult> TrackDownload(int id, CancellationToken cancellationToken)
    {
        var poster = await _posterService.GetPosterByIdAsync(id, cancellationToken);

        if (poster == null)
        {
            return NotFound();
        }

        await _posterService.TrackDownloadAsync(id, cancellationToken);

        return Ok(new { downloadCount = poster.DownloadCount + 1 });
    }
}
    