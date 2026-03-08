namespace MotoManager.Application.DTOs;

public record ServiceOperationDto(
    long Id,
    string Name,
    decimal WorkHours,
    bool IsActive,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt
);
