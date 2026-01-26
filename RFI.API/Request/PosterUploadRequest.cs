using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace RFI.API.Request;

public class PosterUploadRequest
{
    [Required]
    public int EventId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public IFormFile File { get; set; } = default!;

    public IFormFile? Thumbnail { get; set; }
}
