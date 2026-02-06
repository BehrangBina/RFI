namespace RFI.API.DTOs;

    public class CarouselPhotoDto
    {
        public string? Title { get; set; }
        public IFormFile? Photo { get; set; }
        public int Order { get; set; }
    }

