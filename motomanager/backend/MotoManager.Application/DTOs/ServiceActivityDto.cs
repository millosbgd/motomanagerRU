namespace MotoManager.Application.DTOs;

public record ServiceActivityDto(
    long Id,
    string Name,
    bool IsActive,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt
);
