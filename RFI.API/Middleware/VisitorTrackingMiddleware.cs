using RFI.API.Services;

namespace RFI.API.Middleware;

public class VisitorTrackingMiddleware
{
    private readonly RequestDelegate _next;

    public VisitorTrackingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IVisitorTrackingService visitorTrackingService)
    {
        if (context.Request.Method == "GET" &&
            !context.Request.Path.StartsWithSegments("/api") &&
            !context.Request.Path.StartsWithSegments("/swagger"))
        {
            var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var pageUrl = context.Request.Path;
            var userAgent = context.Request.Headers["User-Agent"].ToString();

            await visitorTrackingService.TrackVisitorAsync(ipAddress, pageUrl, userAgent);
        }

        await _next(context);
    }
}

