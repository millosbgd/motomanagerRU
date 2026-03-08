namespace MotoManager.Application.DTOs;

public record UpdateMaterialRequest(string Name, long UnitOfMeasureId, bool IsActive);
