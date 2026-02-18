using MotoManager.Domain.Enums;

namespace MotoManager.Application.DTOs;

public record ServiceOrderDto(
    long Id,
    long VehicleId,
    string Description,
    ServiceOrderStatus Status,
    DateTimeOffset OpenedAt,
    DateTimeOffset? ClosedAt,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt
);
