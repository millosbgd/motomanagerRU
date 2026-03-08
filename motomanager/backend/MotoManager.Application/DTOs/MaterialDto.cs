namespace MotoManager.Application.DTOs;

public record MaterialDto(
    long Id,
    string Name,
    long UnitOfMeasureId,
    string? UnitOfMeasureName,
    bool IsActive,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt
);
