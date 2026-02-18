namespace MotoManager.Application.DTOs;

public record CreateVehicleRequest(
    string Registration,
    string Make,
    string Model,
    int? Year
);
