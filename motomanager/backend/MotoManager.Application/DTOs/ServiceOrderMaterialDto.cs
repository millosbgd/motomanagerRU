namespace MotoManager.Application.DTOs;

public record ServiceOrderMaterialDto(
    long Id,
    long ServiceOrderId,
    long MaterialId,
    string MaterialName,
    string? UnitOfMeasureName,
    decimal Quantity,
    decimal PricePerUnit,
    decimal TotalPrice
);

public record AddServiceOrderMaterialRequest(
    long MaterialId,
    decimal Quantity,
    decimal PricePerUnit
);

public record UpdateServiceOrderMaterialRequest(
    decimal Quantity,
    decimal PricePerUnit
);
