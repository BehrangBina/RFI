namespace RFI.API.Request
{
    public class DonationRequest
    {
        public string? DonorName { get; set; }
        public decimal Amount { get; set; }
        public string? Currency { get; set; }
        public string PayPalTransactionId { get; set; } = string.Empty;
        public string PayPalPayerId { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Message { get; set; }
    }
}
