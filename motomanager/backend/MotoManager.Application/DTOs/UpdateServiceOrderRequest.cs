using MotoManager.Domain.Enums;

namespace MotoManager.Application.DTOs;

public record UpdateServiceOrderRequest(
    long VehicleId,
    string Description,
    ServiceOrderStatus Status,
    DateOnly Date,
    int Mileage
);
