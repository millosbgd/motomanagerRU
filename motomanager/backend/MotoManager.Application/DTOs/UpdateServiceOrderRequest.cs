using MotoManager.Domain.Enums;

namespace MotoManager.Application.DTOs;

public record UpdateServiceOrderRequest(
    string Description,
    ServiceOrderStatus Status
);
