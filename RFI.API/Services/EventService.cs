using RFI.API.DTOs;
using RFI.API.Repositories;

namespace RFI.API.Services;

public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository;

    public EventService(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<IEnumerable<EventDto>> GetAllEventsAsync(CancellationToken cancellationToken = default)
    {
        var events = await _eventRepository.GetActiveEventsAsync(cancellationToken);
        return events.Select(MapToDto);
    }

    public async Task<EventDto?> GetEventByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var eventItem = await _eventRepository.GetByIdAsync(id, cancellationToken);
        return eventItem != null ? MapToDto(eventItem) : null;
    }

    public async Task<IEnumerable<EventDto>> GetUpcomingEventsAsync(CancellationToken cancellationToken = default)
    {
        var events = await _eventRepository.GetUpcomingEventsAsync(cancellationToken);
        return events.Select(MapToDto);
    }

    private static EventDto MapToDto(Models.Event eventItem) => new()
    {
        Id = eventItem.Id,
        Title = eventItem.Title,
        Description = eventItem.Description,
        EventDate = eventItem.EventDate,
        Location = eventItem.Location,
        ImageUrls = eventItem.ImageUrls,
        DetailedContent = eventItem.DetailedContent,
        IsActive = eventItem.IsActive
    };
}
