namespace RFI.API.DTOs;

public record ProductDto(
    int Id,
    string Name,
    string Slug,
    string? Description,
    string Category,
    decimal Price,
    string? ImageUrl,
    int StockQuantity,
    bool IsActive,
    bool RequiresShipping,
    DateTime CreatedAt
);

public record CreateProductDto(
    string Name,
    string? Description,
    string Category,
    decimal Price,
    string? ImageUrl,
    int StockQuantity,
    bool RequiresShipping
);

public record UpdateProductDto(
    string Name,
    string? Description,
    string Category,
    decimal Price,
    string? ImageUrl,
    int StockQuantity,
    bool IsActive,
    bool RequiresShipping
);
