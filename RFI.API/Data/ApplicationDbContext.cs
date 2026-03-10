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
        public DbSet<SubjectCategory> SubjectCategories { get; set; }
        public DbSet<Training> Trainings { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<TicketPurchase> TicketPurchases { get; set; }
        public DbSet<OrganizationMembers> OrganizationMembers { get; set; }
        
        // Shop/Ecommerce
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<TicketInstance> TicketInstances { get; set; }

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

            // Training configuration
            modelBuilder.Entity<SubjectCategory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Slug).IsRequired();
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.Property(e => e.Description).IsRequired();
                entity.HasMany(sc => sc.Trainings)
                    .WithOne(t => t.SubjectCategory)
                    .HasForeignKey(t => t.SubjectCategoryId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Training>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired();
                entity.Property(e => e.Slug).IsRequired();
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.Property(e => e.Content).IsRequired();
            });

            // Membership configuration
            modelBuilder.Entity<Membership>()
                .HasIndex(m => m.Email)
                .IsUnique();
            
            // Product configuration
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Slug).IsRequired();
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.Property(e => e.Category).IsRequired();
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            });
            
            // Order configuration
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.OrderNumber).IsRequired();
                entity.HasIndex(e => e.OrderNumber).IsUnique();
                entity.Property(e => e.CustomerName).IsRequired();
                entity.Property(e => e.CustomerEmail).IsRequired();
                entity.Property(e => e.PaymentStatus).IsRequired();
                entity.Property(e => e.SubtotalPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ShippingCost).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
                
                entity.HasMany(o => o.Items)
                    .WithOne(i => i.Order)
                    .HasForeignKey(i => i.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            
            // OrderItem configuration
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ItemType).IsRequired();
                entity.Property(e => e.ItemName).IsRequired();
                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
                
                entity.HasMany(oi => oi.TicketInstances)
                    .WithOne(t => t.OrderItem)
                    .HasForeignKey(t => t.OrderItemId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            
            // TicketInstance configuration
            modelBuilder.Entity<TicketInstance>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TicketCode).IsRequired();
                entity.HasIndex(e => e.TicketCode).IsUnique();
            });
        }
    }
}