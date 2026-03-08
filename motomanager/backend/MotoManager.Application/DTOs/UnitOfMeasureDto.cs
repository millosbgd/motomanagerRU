namespace MotoManager.Application.DTOs;

public record UnitOfMeasureDto(
    long Id,
    string Name,
    bool IsActive,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt
);
