namespace MotoManager.Application.DTOs;

public record VehicleDto(
    long Id,
    string Registration,
    string Make,
    string Model,
    int? Year,
    bool IsActive,
    long? ClientId,
    string? ClientName,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt
);
