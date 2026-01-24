namespace RFI.API.Models
{
    public record Donation
    {
        public int Id { get; set; }
        public string DonorName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string PayPalTransactionId { get; set; } = string.Empty;
        public string PayPalPayerId { get; set; } = string.Empty;
        public DateTime DonatedAt { get; set; } = DateTime.UtcNow;
        public string Message { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
