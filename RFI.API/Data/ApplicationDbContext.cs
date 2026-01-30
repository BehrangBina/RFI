using Microsoft.EntityFrameworkCore;
using RFI.API.Models;

namespace RFI.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<RfiItem> RfiItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed some sample data
        modelBuilder.Entity<RfiItem>().HasData(
            new RfiItem
            {
                Id = 1,
                Title = "Sample RFI 1",
                Description = "This is a sample Request for Information",
                Status = "Pending",
                CreatedDate = DateTime.UtcNow,
                DueDate = DateTime.UtcNow.AddDays(7)
            },
            new RfiItem
            {
                Id = 2,
                Title = "Sample RFI 2",
                Description = "Another sample RFI",
                Status = "In Progress",
                CreatedDate = DateTime.UtcNow,
                DueDate = DateTime.UtcNow.AddDays(14)
            }
        );
    }
}
