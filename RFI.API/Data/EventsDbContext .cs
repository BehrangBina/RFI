using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using RFI.API.Models;

namespace RFI.API.Data;

 public class EventsDbContext : DbContext
    {
        private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions();

        public EventsDbContext(DbContextOptions<EventsDbContext> options) 
            : base(options)
        {
        }

        public DbSet<Event> Events { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure ImageUrls as JSON column
            modelBuilder.Entity<Event>()
                .Property(e => e.ImageUrls)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, _jsonOptions),
                    v => JsonSerializer.Deserialize<List<string>>(v, _jsonOptions) ?? new List<string>());


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
        }
    }