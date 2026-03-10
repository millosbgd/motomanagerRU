namespace MotoManager.Application.DTOs;

public record ServiceActivityDefaultOperationDto(
    long Id,
    long ServiceActivityId,
    long ServiceOperationId,
    string OperationName,
    decimal WorkHours
);

public record AddServiceActivityDefaultOperationRequest(
    long ServiceOperationId,
    decimal WorkHours
);

public record UpdateServiceActivityDefaultOperationRequest(
    decimal WorkHours
);
