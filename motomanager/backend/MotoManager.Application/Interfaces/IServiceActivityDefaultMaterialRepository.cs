using MotoManager.Domain.Entities;

namespace MotoManager.Application.Interfaces;

public interface IServiceActivityDefaultMaterialRepository
{
    Task<List<ServiceActivityDefaultMaterial>> GetByActivityAsync(long serviceActivityId, CancellationToken ct);
    Task<ServiceActivityDefaultMaterial?> GetByIdAsync(long id, CancellationToken ct);
    Task<bool> AddToActivityAsync(ServiceActivityDefaultMaterial entry, CancellationToken ct);
    Task UpdateAsync(ServiceActivityDefaultMaterial entry, CancellationToken ct);
    Task<bool> RemoveAsync(long id, CancellationToken ct);
}
