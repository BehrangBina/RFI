namespace RFI.API.DTOs;

public record OrderDto(
    int Id,
    string OrderNumber,
    string CustomerName,
    string CustomerEmail,
    string? CustomerPhone,
    decimal SubtotalPrice,
    decimal ShippingCost,
    decimal TotalPrice,
    string PaymentStatus,
    string? PaymentMethod,
    DateTime OrderDate,
    string? ShippingAddress,
    string? ShippingCity,
    string? ShippingPostalCode,
    string? ShippingCountry,
    string? TrackingNumber,
    List<OrderItemDto> Items
);

public record OrderItemDto(
    int Id,
    string ItemType,
    string ItemName,
    decimal UnitPrice,
    int Quantity,
    decimal TotalPrice,
    int? ProductId,
    int? EventId,
    List<string>? TicketCodes // For event tickets
);

public record CreateOrderDto(
    string CustomerName,
    string CustomerEmail,
    string? CustomerPhone,
    string? ShippingAddress,
    string? ShippingCity,
    string? ShippingPostalCode,
    string? ShippingCountry,
    List<CreateOrderItemDto> Items
);

public record CreateOrderItemDto(
    string ItemType, // "Product" or "EventTicket"
    int? ProductId,
    int? EventId,
    int Quantity
);
