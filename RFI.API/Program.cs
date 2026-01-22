using RFI.API.Middleware;
using RFI.API.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddDbContext<EventsDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("RfiSqlite")));

builder.Services.AddDbContext<EventsDbContext>(options =>
    options.UseSqlite("Data Source=events.db"));

builder.Services.AddHttpClient<IGeoLocationService, GeoLocationService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader());
});

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.MapOpenApi();

}

app.UseHttpsRedirection();
app.UseCors("AllowReact");
app.UseMiddleware<VisitorTrackingMiddleware>();

app.UseHttpsRedirection();
app.MapControllers();

app.Run();