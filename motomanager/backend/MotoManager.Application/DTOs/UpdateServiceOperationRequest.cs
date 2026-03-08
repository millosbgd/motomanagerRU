namespace MotoManager.Application.DTOs;

public record UpdateServiceOperationRequest(string Name, decimal WorkHours, bool IsActive);
