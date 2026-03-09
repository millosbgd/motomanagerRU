namespace MotoManager.Application.DTOs;

public record ServiceOrderOperationDto(
    long Id,
    long ServiceOrderId,
    long ServiceOperationId,
    string OperationName,
    decimal WorkHours,
    decimal PricePerHour,
    decimal TotalPrice
);

public record AddServiceOrderOperationRequest(
    long ServiceOperationId,
    decimal WorkHours,
    decimal PricePerHour
);

public record UpdateServiceOrderOperationRequest(
    decimal WorkHours,
    decimal PricePerHour
);
