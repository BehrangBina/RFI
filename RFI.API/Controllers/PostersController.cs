namespace RFI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostersController : ControllerBase
    {
        private readonly EventsDbContext _context;

        public PostersController(EventsDbContext context)
        {
            _context = context;
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
    