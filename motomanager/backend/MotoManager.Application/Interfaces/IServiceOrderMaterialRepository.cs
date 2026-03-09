using MotoManager.Domain.Entities;

namespace MotoManager.Application.Interfaces;

public interface IServiceOrderMaterialRepository
{
    Task<List<ServiceOrderMaterial>> GetByServiceOrderAsync(long serviceOrderId, CancellationToken ct);
    Task<ServiceOrderMaterial?> GetByIdAsync(long id, CancellationToken ct);
    Task AddAsync(ServiceOrderMaterial material, CancellationToken ct);
    Task UpdateAsync(ServiceOrderMaterial material, CancellationToken ct);
    Task<bool> RemoveAsync(long id, CancellationToken ct);
}
