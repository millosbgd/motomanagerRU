namespace MotoManager.Application.DTOs;

public record UpdateVehicleRequest(
    string Registration,
    string Make,
    string Model,
    int? Year,
    bool IsActive
);
