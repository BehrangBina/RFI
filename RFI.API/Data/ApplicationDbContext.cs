using Microsoft.EntityFrameworkCore;
using RFI.API.Models;

namespace RFI.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Poster> Posters { get; set; }
}
