using Microsoft.AspNetCore.Http;

namespace RFI.API.DTOs
{
    public class UploadPosterDto
    {
        public required IFormFile File { get; set; }
        public IFormFile? Thumbnail { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
    }
}
