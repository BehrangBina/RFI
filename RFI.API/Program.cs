using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddDbContext<EventsDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("RfiSqlite")));

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.MapOpenApi();
}


app.UseHttpsRedirection();
app.MapControllers(); // Important!

app.Run();