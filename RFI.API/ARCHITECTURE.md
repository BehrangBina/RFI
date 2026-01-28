# Backend Architecture Documentation - SOLID Principles Applied

## 🎯 Architecture Overview

The RFI.API has been refactored to follow **SOLID principles** and achieve **loose coupling** through a layered architecture:

```
┌─────────────────────────────────────┐
│        Controllers Layer            │  ← Thin orchestrators
│  (EventsController, etc.)           │
└─────────────┬───────────────────────┘
              │ depends on
┌─────────────▼───────────────────────┐
│         Service Layer               │  ← Business logic
│  (IEventService, etc.)              │
└─────────────┬───────────────────────┘
              │ depends on
┌─────────────▼───────────────────────┐
│       Repository Layer              │  ← Data access
│  (IEventRepository, etc.)           │
└─────────────┬───────────────────────┘
              │ depends on
┌─────────────▼───────────────────────┐
│        DbContext Layer              │  ← Entity Framework
│   (EventsDbContext)                 │
└─────────────────────────────────────┘
```

## 📁 Project Structure

```
RFI.API/
├── Controllers/          # API endpoints (thin layer)
│   ├── EventsController.cs
│   ├── DonationsController.cs
│   ├── PostersController.cs
│   └── AnalyticsController.cs
├── Services/            # Business logic
│   ├── Interfaces/
│   │   ├── IEventService.cs
│   │   ├── IDonationService.cs
│   │   ├── IPosterService.cs
│   │   ├── IAnalyticsService.cs
│   │   └── IVisitorTrackingService.cs
│   └── Implementations/
│       ├── EventService.cs
│       ├── DonationService.cs
│       ├── PosterService.cs
│       ├── AnalyticsService.cs
│       └── VisitorTrackingService.cs
├── Repositories/        # Data access
│   ├── Interfaces/
│   │   ├── IRepository.cs (generic)
│   │   ├── IEventRepository.cs
│   │   ├── IDonationRepository.cs
│   │   ├── IPosterRepository.cs
│   │   └── IVisitorRepository.cs
│   └── Implementations/
│       ├── Repository.cs (generic)
│       ├── EventRepository.cs
│       ├── DonationRepository.cs
│       ├── PosterRepository.cs
│       └── VisitorRepository.cs
├── DTOs/                # Data Transfer Objects
│   ├── EventDto.cs
│   ├── DonationDto.cs
│   ├── PosterDto.cs
│   └── AnalyticsDto.cs
├── Models/              # Domain entities
├── Data/                # DbContext
└── Middleware/          # Cross-cutting concerns
```

## 🔧 SOLID Principles Applied

### ✅ Single Responsibility Principle (SRP)

**Before:**
```csharp
public class EventsController : ControllerBase
{
    private readonly EventsDbContext _context;
    
    public async Task<ActionResult> GetEvents()
    {
        var events = await _context.Events
            .Where(e => e.IsActive)
            .OrderBy(e => e.EventDate)
            .ToListAsync();
        return Ok(events);
    }
}
```
❌ Controller handles: routing, data access, business logic, response formatting

**After:**
```csharp
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;
    
    public async Task<ActionResult<IEnumerable<EventDto>>> GetEvents(
        CancellationToken cancellationToken)
    {
        var events = await _eventService.GetAllEventsAsync(cancellationToken);
        return Ok(events);
    }
}
```
✅ Controller only handles: routing and orchestration

Each class now has one reason to change:
- **Controllers**: API contract changes
- **Services**: Business logic changes
- **Repositories**: Data access changes
- **DTOs**: Response structure changes

### ✅ Open/Closed Principle (OCP)

**Extensible without modification:**

```csharp
// Add new repository method without changing existing code
public interface IEventRepository : IRepository<Event>
{
    Task<IEnumerable<Event>> GetActiveEventsAsync(...);
    Task<IEnumerable<Event>> GetUpcomingEventsAsync(...);
    // Easy to add: Task<IEnumerable<Event>> GetPastEventsAsync(...);
}

// Add new service without modifying existing services
public interface IEventService
{
    Task<IEnumerable<EventDto>> GetAllEventsAsync(...);
    // Easy to add new methods
}
```

### ✅ Liskov Substitution Principle (LSP)

```csharp
// Generic repository can be substituted by specific implementations
IRepository<Event> repo = new EventRepository(context);
IEventRepository eventRepo = new EventRepository(context);

// Both work correctly without breaking behavior
var event = await repo.GetByIdAsync(1);
var events = await eventRepo.GetActiveEventsAsync();
```

### ✅ Interface Segregation Principle (ISP)

```csharp
// Interfaces are focused and segregated
public interface IEventService
{
    // Only event-related methods
}

public interface IDonationService
{
    // Only donation-related methods
}

// Services don't depend on methods they don't use
```

### ✅ Dependency Inversion Principle (DIP)

**Before:**
```csharp
public class EventsController : ControllerBase
{
    private readonly EventsDbContext _context; // ❌ Depends on concrete class
}
```

**After:**
```csharp
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService; // ✅ Depends on abstraction
}

public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository; // ✅ Depends on abstraction
}
```

## 🔄 Data Flow

### Example: Getting Events

```
1. HTTP GET /api/events
        ↓
2. EventsController.GetEvents()
        ↓
3. IEventService.GetAllEventsAsync()
        ↓
4. IEventRepository.GetActiveEventsAsync()
        ↓
5. EventsDbContext.Events (EF Core)
        ↓
6. Database Query
        ↓
7. Event entities ← returned
        ↓
8. EventDto objects (mapped)
        ↓
9. JSON response
```

## 🔌 Dependency Injection Setup

**Program.cs:**
```csharp
// Repository Layer
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IDonationRepository, DonationRepository>();
builder.Services.AddScoped<IPosterRepository, PosterRepository>();
builder.Services.AddScoped<IVisitorRepository, VisitorRepository>();

// Service Layer
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IDonationService, DonationService>();
builder.Services.AddScoped<IPosterService, PosterService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<IVisitorTrackingService, VisitorTrackingService>();

// Infrastructure Services
builder.Services.AddScoped<IPosterAssetService, LocalPosterAssetService>();
builder.Services.AddHttpClient<IGeoLocationService, GeoLocationService>();
```

## 📊 Benefits Achieved

### 1. **Loose Coupling**
- Controllers don't know about DbContext
- Services don't know about EF Core implementation details
- Easy to swap implementations (e.g., different data sources)

### 2. **Testability**
```csharp
// Easy to mock dependencies
var mockRepo = new Mock<IEventRepository>();
var service = new EventService(mockRepo.Object);
```

### 3. **Maintainability**
- Changes to data access don't affect business logic
- Changes to business logic don't affect controllers
- Clear separation of concerns

### 4. **Scalability**
- Easy to add caching layer
- Easy to add validation layer
- Easy to add logging/auditing

### 5. **Reusability**
- Services can be used by multiple controllers
- Repositories can be used by multiple services
- Common logic centralized

## 🎯 Design Patterns Used

1. **Repository Pattern**: Abstracts data access
2. **Service Layer Pattern**: Encapsulates business logic
3. **Dependency Injection**: Manages dependencies
4. **DTO Pattern**: Separates API models from domain models
5. **Generic Repository**: Reduces code duplication

## 🚀 Adding New Features

### Example: Adding a Comments Feature

1. **Create Model:**
```csharp
public class Comment
{
    public int Id { get; set; }
    public string Text { get; set; }
    public int EventId { get; set; }
}
```

2. **Create Repository:**
```csharp
public interface ICommentRepository : IRepository<Comment>
{
    Task<IEnumerable<Comment>> GetByEventIdAsync(int eventId);
}

public class CommentRepository : Repository<Comment>, ICommentRepository
{
    // Implementation
}
```

3. **Create Service:**
```csharp
public interface ICommentService
{
    Task<IEnumerable<CommentDto>> GetCommentsAsync(int eventId);
}

public class CommentService : ICommentService
{
    private readonly ICommentRepository _repository;
    // Implementation
}
```

4. **Create Controller:**
```csharp
[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;
    // Implementation
}
```

5. **Register in DI:**
```csharp
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<ICommentService, CommentService>();
```

## 📝 Best Practices

1. **Always depend on abstractions (interfaces)**
2. **Keep controllers thin** - only orchestration
3. **Keep business logic in services**
4. **Keep data access in repositories**
5. **Use DTOs for API responses** - don't expose domain models
6. **Use CancellationTokens** for async operations
7. **Handle errors at appropriate layers**
8. **Use dependency injection** for all dependencies

## 🔍 Code Comparison

### Before Refactoring (Violations)
- ❌ Controllers directly accessing DbContext
- ❌ Business logic in controllers
- ❌ Tight coupling to EF Core
- ❌ Hard to test
- ❌ Hard to change data source
- ❌ Violates SRP, DIP

### After Refactoring (SOLID)
- ✅ Clear layer separation
- ✅ Loose coupling through interfaces
- ✅ Easy to test with mocks
- ✅ Easy to swap implementations
- ✅ Follows all SOLID principles
- ✅ Clean architecture

## 🎓 Summary

The refactored architecture provides:
- **Better maintainability** through separation of concerns
- **Higher testability** through dependency injection
- **Greater flexibility** through loose coupling
- **Easier extensibility** through interface-based design
- **Improved code quality** through SOLID principles
