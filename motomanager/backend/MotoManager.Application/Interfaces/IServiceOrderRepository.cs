using MotoManager.Domain.Entities;

namespace MotoManager.Application.Interfaces;

public interface IServiceOrderRepository
{
    Task<List<ServiceOrder>> GetAllAsync(CancellationToken ct);
    Task<ServiceOrder?> GetByIdAsync(long id, CancellationToken ct);
    Task AddAsync(ServiceOrder order, CancellationToken ct);
    Task UpdateAsync(ServiceOrder order, CancellationToken ct);
}
