using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RFI.API.Models;

namespace RFI.API.Data;

    public class AdminDbContext : DbContext
    {
        public AdminDbContext(DbContextOptions<AdminDbContext> options) : base(options)
        {
        }

        public DbSet<CarouselPhoto> CarouselPhotos { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CarouselPhoto>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ImageUrl).IsRequired();
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired();
                entity.Property(e => e.Email).IsRequired();
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                
                // Seed default admin user
                // TODO: Change password in production via environment variable
                var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD") ?? "admin123";
                entity.HasData(new User
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@rfi.org",
                    PasswordHash = HashPassword(adminPassword),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                });
            });
        }

        private static string HashPassword(string password)
        {
            // Using ASP.NET Core Identity's PasswordHasher for better security
            var hasher = new PasswordHasher<User>();
            return hasher.HashPassword(null!, password);
        }
    }
