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
                entity.HasMany(e => e.Sections)
                    .WithOne(e => e.News)
                    .HasForeignKey(e => e.NewsId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // NewsSection configuration
            modelBuilder.Entity<NewsSection>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SectionType).IsRequired();
                entity.HasMany(e => e.KeyPoints)
                    .WithOne(e => e.NewsSection)
                    .HasForeignKey(e => e.NewsSectionId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // KeyPoint configuration
            modelBuilder.Entity<KeyPoint>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Description).IsRequired();
            });
        }
    }
}