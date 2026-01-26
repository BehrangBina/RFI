using RFI.API.Request;
using RFI.API.Services;
using System.IO;

namespace RFI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostersController : ControllerBase
    {
        private readonly EventsDbContext _context;
        private readonly IPosterAssetService _posterAssets;

        public PostersController(EventsDbContext context, IPosterAssetService posterAssets)
        {
            _context = context;
            _posterAssets = posterAssets;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Poster>>> GetPosters()
        {
            var posters = await _context.Posters
                .AsNoTracking()
                .OrderByDescending(p => p.UploadedAt)
                .ToListAsync();

            return Ok(posters);
        }

        // GET: api/posters/event/1
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<Poster>>> GetPostersByEvent(int eventId)
        {
            var posters = await _context.Posters
                .Where(p => p.EventId == eventId)
                .OrderBy(p => p.Title)
                .ToListAsync();

            return Ok(posters);
        }

        // GET: api/posters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Poster>> GetPoster(int id)
        {
            var poster = await _context.Posters.FindAsync(id);

            if (poster == null)
            {
                return NotFound();
            }

            return Ok(poster);
        }

        // POST: api/posters
        [HttpPost]
        [RequestSizeLimit(60_000_000)]
        public async Task<ActionResult<Poster>> UploadPoster([FromForm] PosterUploadRequest request, CancellationToken cancellationToken)
        {
            var targetEvent = await _context.Events.FindAsync(new object?[] { request.EventId }, cancellationToken);
            if (targetEvent == null)
            {
                return BadRequest($"Event with id {request.EventId} was not found.");
            }

            if (request.File == null || request.File.Length == 0)
            {
                return BadRequest("Poster file is required.");
            }

            var posterAsset = await _posterAssets.SaveAsync(request.File, request.EventId.ToString(), cancellationToken);

            string thumbnailUrl = string.Empty;
            if (request.Thumbnail is { Length: > 0 })
            {
                var thumbAsset = await _posterAssets.SaveAsync(request.Thumbnail, Path.Combine(request.EventId.ToString(), "thumbs"), cancellationToken);
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

            _context.Posters.Add(poster);
            await _context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetPoster), new { id = poster.Id }, poster);
        }

        // POST: api/posters/5/download
        [HttpPost("{id}/download")]
        public async Task<ActionResult> TrackDownload(int id)
        {
            var poster = await _context.Posters.FindAsync(id);

            if (poster == null)
            {
                return NotFound();
            }

            poster.DownloadCount++;
            await _context.SaveChangesAsync();

            return Ok(new { downloadCount = poster.DownloadCount });
        }
    }
}
    