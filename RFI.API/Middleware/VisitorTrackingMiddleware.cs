using RFI.API.Services;

namespace RFI.API.Middleware
{
    public class VisitorTrackingMiddleware
    {
            private readonly RequestDelegate _next;

            public VisitorTrackingMiddleware(RequestDelegate next)
            {
                _next = next;
            }

            public async Task InvokeAsync(HttpContext context, EventsDbContext dbContext, IGeoLocationService geoService)
            {
                if (context.Request.Method == "GET" &&
                    !context.Request.Path.StartsWithSegments("/api") &&
                    !context.Request.Path.StartsWithSegments("/swagger"))
                {
                    var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                    // Get country and city
                    var (country, city) = await geoService.GetLocationAsync(ipAddress);

                    var visitor = new Visitor
                    {
                        IpAddress = ipAddress,
                        Country = country,      // ADD
                        City = city,            // ADD
                        PageUrl = context.Request.Path,
                        UserAgent = context.Request.Headers["User-Agent"].ToString(),
                        VisitedAt = DateTime.UtcNow
                    };

                    dbContext.Visitors.Add(visitor);
                    await dbContext.SaveChangesAsync();
                }

                await _next(context);
            }
        }
    }
}
