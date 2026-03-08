using MotoManager.Application.DTOs;

namespace MotoManager.Application.Interfaces;

public interface IUnitOfMeasureService
{
    Task<List<UnitOfMeasureDto>> GetAllAsync(CancellationToken ct);
    Task<UnitOfMeasureDto?> GetByIdAsync(long id, CancellationToken ct);
    Task<UnitOfMeasureDto> CreateAsync(CreateUnitOfMeasureRequest request, CancellationToken ct);
    Task<UnitOfMeasureDto?> UpdateAsync(long id, UpdateUnitOfMeasureRequest request, CancellationToken ct);
    Task<bool> DeleteAsync(long id, CancellationToken ct);
}
