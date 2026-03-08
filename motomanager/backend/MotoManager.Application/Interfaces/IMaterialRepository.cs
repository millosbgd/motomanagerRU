using MotoManager.Domain.Entities;

namespace MotoManager.Application.Interfaces;

public interface IMaterialRepository
{
    Task<List<Material>> GetAllAsync(CancellationToken ct);
    Task<Material?> GetByIdAsync(long id, CancellationToken ct);
    Task AddAsync(Material material, CancellationToken ct);
    Task UpdateAsync(Material material, CancellationToken ct);
    Task<bool> DeleteAsync(long id, CancellationToken ct);
}
