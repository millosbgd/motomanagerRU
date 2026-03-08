using MotoManager.Domain.Entities;

namespace MotoManager.Application.Interfaces;

public interface IUnitOfMeasureRepository
{
    Task<List<UnitOfMeasure>> GetAllAsync(CancellationToken ct);
    Task<UnitOfMeasure?> GetByIdAsync(long id, CancellationToken ct);
    Task AddAsync(UnitOfMeasure unitOfMeasure, CancellationToken ct);
    Task UpdateAsync(UnitOfMeasure unitOfMeasure, CancellationToken ct);
    Task<bool> DeleteAsync(long id, CancellationToken ct);
}
