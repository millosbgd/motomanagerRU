using MotoManager.Domain.Entities;

namespace MotoManager.Application.Interfaces;

public interface IServiceActivityRepository
{
    Task<List<ServiceActivity>> GetAllAsync(CancellationToken ct);
    Task<ServiceActivity?> GetByIdAsync(long id, CancellationToken ct);
    Task<List<ServiceActivity>> GetByServiceOrderAsync(long serviceOrderId, CancellationToken ct);
    Task AddAsync(ServiceActivity activity, CancellationToken ct);
    Task UpdateAsync(ServiceActivity activity, CancellationToken ct);
    Task<bool> DeleteAsync(long id, CancellationToken ct);
    Task<bool> AddToOrderAsync(long serviceOrderId, long serviceActivityId, CancellationToken ct);
    Task<bool> RemoveFromOrderAsync(long serviceOrderId, long serviceActivityId, CancellationToken ct);
}
