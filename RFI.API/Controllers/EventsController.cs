using RFI.API.DTOs;
using RFI.API.Services;

namespace RFI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventsController(IEventService eventService)
    {
        _eventService = eventService;
    }

    // GET: api/events
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventDto>>> GetEvents(CancellationToken cancellationToken)
    {
        var events = await _eventService.GetAllEventsAsync(cancellationToken);
        return Ok(events);
    }

    // GET: api/events/5
    [HttpGet("{id}")]
    public async Task<ActionResult<EventDto>> GetEvent(int id, CancellationToken cancellationToken)
    {
        var eventItem = await _eventService.GetEventByIdAsync(id, cancellationToken);

        if (eventItem == null)
        {
            return NotFound();
        }

        return Ok(eventItem);
    }

    // GET: api/events/upcoming
    [HttpGet("upcoming")]
    public async Task<ActionResult<IEnumerable<EventDto>>> GetUpcomingEvents(CancellationToken cancellationToken)
    {
        var upcomingEvents = await _eventService.GetUpcomingEventsAsync(cancellationToken);
        return Ok(upcomingEvents);
    }
}