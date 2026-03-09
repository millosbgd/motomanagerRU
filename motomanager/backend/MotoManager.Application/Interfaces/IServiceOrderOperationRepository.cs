using MotoManager.Domain.Entities;

namespace MotoManager.Application.Interfaces;

public interface IServiceOrderOperationRepository
{
    Task<List<ServiceOrderOperation>> GetByServiceOrderAsync(long serviceOrderId, CancellationToken ct);
    Task<ServiceOrderOperation?> GetByIdAsync(long id, CancellationToken ct);
    Task AddAsync(ServiceOrderOperation operation, CancellationToken ct);
    Task UpdateAsync(ServiceOrderOperation operation, CancellationToken ct);
    Task<bool> RemoveAsync(long id, CancellationToken ct);
}
