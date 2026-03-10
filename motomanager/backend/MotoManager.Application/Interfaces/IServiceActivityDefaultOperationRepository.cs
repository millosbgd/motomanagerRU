using MotoManager.Domain.Entities;

namespace MotoManager.Application.Interfaces;

public interface IServiceActivityDefaultOperationRepository
{
    Task<List<ServiceActivityDefaultOperation>> GetByActivityAsync(long serviceActivityId, CancellationToken ct);
    Task<ServiceActivityDefaultOperation?> GetByIdAsync(long id, CancellationToken ct);
    Task<bool> AddToActivityAsync(ServiceActivityDefaultOperation entry, CancellationToken ct);
    Task UpdateAsync(ServiceActivityDefaultOperation entry, CancellationToken ct);
    Task<bool> RemoveAsync(long id, CancellationToken ct);
}
