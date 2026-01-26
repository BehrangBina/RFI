using RFI.API.Middleware;
using RFI.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<EventsDbContext>(options =>
{
    var provider = builder.Configuration["Database:Provider"]?.ToLowerInvariant() ?? "sqlite";
    var configuredConnectionName = builder.Configuration["Database:ConnectionStringName"];

    string ResolveConnection(string fallbackName, string? defaultValue = null)
    {
        var nameToUse = string.IsNullOrWhiteSpace(configuredConnectionName) ? fallbackName : configuredConnectionName;
        var connection = builder.Configuration.GetConnectionString(nameToUse);

        if (!string.IsNullOrWhiteSpace(connection))
        {
            return connection;
        }

        if (!string.IsNullOrWhiteSpace(defaultValue))
        {
            return defaultValue;
        }

        throw new InvalidOperationException($"Missing connection string '{nameToUse}'.");
    }

    switch (provider)
    {
        case "sqlserver":
            options.UseSqlServer(ResolveConnection("SqlServer"));
            break;

        case "postgres":
        case "postgresql":
        case "npgsql":
            options.UseNpgsql(ResolveConnection("Postgres"));
            break;

        case "mysql":
        case "mariadb":
            {
                var connection = ResolveConnection("MySql");
                options.UseMySql(connection, ServerVersion.AutoDetect(connection));
                break;
            }

        default:
            options.UseSqlite(ResolveConnection("RfiSqlite", "Data Source=App_Data/rfi.db"));
            break;
    }
});
builder.Services.Configure<PosterStorageOptions>(builder.Configuration.GetSection("PosterStorage"));
builder.Services.AddScoped<IPosterAssetService, LocalPosterAssetService>();

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
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowReact");
app.UseMiddleware<VisitorTrackingMiddleware>();

app.MapControllers();

app.Run();