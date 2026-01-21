using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Text.Json;

namespace RFI.API.Data;

public class EventsDbContext : DbContext
{
    private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions();

    public EventsDbContext(DbContextOptions<EventsDbContext> options)
        : base(options)
    {
    }

    public DbSet<Event> Events { get; set; }
    public DbSet<Poster> Posters { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Poster>()
               .HasOne(p => p.Event)
               .WithMany()
               .HasForeignKey(p => p.EventId)
               .OnDelete(DeleteBehavior.Cascade);

        // Configure ImageUrls as JSON column
        modelBuilder.Entity<Event>(entity =>
            {
                entity.Property(e => e.ImageUrls)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, _jsonOptions),
                        v => JsonSerializer.Deserialize<List<string>>(v, _jsonOptions) ?? new List<string>())
                    .Metadata.SetValueComparer(new ValueComparer<List<string>>(
                        (c1, c2) => c1!.SequenceEqual(c2!),
                        c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),

                        c => c.ToList()));
            });


        // Seed some sample data
        modelBuilder.Entity<Event>().HasData(
            new Event
            {
                Id = 1,
                Title = "Parliament Steps Vigil Australia - Melbourne",
                Description = "Justice for 30,000 Iranians - Crimes against humanity must be stopped.",
                EventDate = new DateTime(2026, 1, 18),
                Location = "Parliament House, Melbourne",
                ImageUrls = new List<string> { "https://www.riseforiran.org/images/highlights/18Jan.png" },
                DetailedContent = "Iranians in Melbourne are gathering in front of Parliament House today from 4:00 pm to 6:00 pm to support King Reza Pahlavi and stand shoulder to shoulder with people inside Iran. Protesters are amplifying the voices of families demanding justice for more than 30,000 people killed by the regime and are calling for urgent international action to hold Tehran accountable for its crimes.",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            },
            new Event
            {
                Id = 2,
                Title = "The Last Fight",
                Description = "Stand with Iran",
                EventDate = new DateTime(2026, 1, 4),
                Location = "TBD",
                ImageUrls = new List<string>(),
                DetailedContent = "Details coming soon.",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            }
        );

        modelBuilder.Entity<Poster>().HasData(
               new Poster
               {
                   Id = 1,
                   EventId = 1,
                   Title = "Charity Run Poster - English",
                   FileUrl = "/posters/charity-run-en.pdf",
                   ThumbnailUrl = "/posters/thumbs/charity-run-en.jpg",
                   FileSize = 2048000,
                   DownloadCount = 0,
                   UploadedAt = DateTime.UtcNow
               },
               new Poster
               {
                   Id = 2,
                   EventId = 1,
                   Title = "Charity Run Poster - Spanish",
                   FileUrl = "/posters/charity-run-es.pdf",
                   ThumbnailUrl = "/posters/thumbs/charity-run-es.jpg",
                   FileSize = 2100000,
                   DownloadCount = 0,
                   UploadedAt = DateTime.UtcNow
               },
               new Poster
               {
                   Id = 3,
                   EventId = 2,
                   Title = "Food Drive Flyer",
                   FileUrl = "/posters/food-drive.pdf",
                   ThumbnailUrl = "/posters/thumbs/food-drive.jpg",
                   FileSize = 1800000,
                   DownloadCount = 0,
                   UploadedAt = DateTime.UtcNow
               }
           );
    }
}
