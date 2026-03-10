namespace RFI.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Admin"; // Admin or Customer
        public DateTime CreatedAt { get; set; }
        
        // Navigation
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
