namespace MotoManager.Application.DTOs;

public record CreateServiceOrderRequest(
    long VehicleId,
    string Description
);
