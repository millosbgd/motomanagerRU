namespace MotoManager.Application.DTOs;

public record ServiceActivityDefaultMaterialDto(
    long Id,
    long ServiceActivityId,
    long MaterialId,
    string MaterialName,
    string? UnitOfMeasureName,
    decimal Quantity
);

public record AddServiceActivityDefaultMaterialRequest(
    long MaterialId,
    decimal Quantity
);

public record UpdateServiceActivityDefaultMaterialRequest(
    decimal Quantity
);
