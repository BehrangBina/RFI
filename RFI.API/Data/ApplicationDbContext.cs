using Microsoft.EntityFrameworkCore;
using RFI.API.Models;

namespace RFI.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Poster> Posters { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<NewsSection> NewsSections { get; set; }
        public DbSet<KeyPoint> KeyPoints { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventImage> EventImages { get; set; }
        public DbSet<EventSection> EventSections { get; set; }
        public DbSet<HeroSlide> HeroSlides { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // News configuration
            modelBuilder.Entity<News>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired();
                entity.Property(e => e.Slug).IsRequired();
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.Property(e => e.Summary).IsRequired();
            });

            modelBuilder.Entity<NewsSection>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SectionType).IsRequired();
            });

            modelBuilder.Entity<KeyPoint>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Description).IsRequired();
            });

            // Event configuration
            modelBuilder.Entity<Event>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired();
                entity.Property(e => e.Slug).IsRequired();
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.Property(e => e.Summary).IsRequired();
                entity.Property(e => e.Category).IsRequired();
                entity.HasMany(e => e.Images)
                    .WithOne(i => i.Event)
                    .HasForeignKey(i => i.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasMany(e => e.Sections)
                    .WithOne(s => s.Event)
                    .HasForeignKey(s => s.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<EventImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ImageUrl).IsRequired();
            });

            modelBuilder.Entity<EventSection>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SectionType).IsRequired();
                entity.Property(e => e.Content).IsRequired();
            });
        }
    }
}