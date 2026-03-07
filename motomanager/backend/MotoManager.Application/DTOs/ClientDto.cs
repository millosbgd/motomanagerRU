namespace MotoManager.Application.DTOs;

public record ClientDto(
    long Id,
    string Name,
    string? Address,
    string? City,
    string? Country,
    bool IsActive
);

public record CreateClientRequest(
    string Name,
    string? Address,
    string? City,
    string? Country
);

public record UpdateClientRequest(
    string Name,
    string? Address,
    string? City,
    string? Country,
    bool IsActive
);
