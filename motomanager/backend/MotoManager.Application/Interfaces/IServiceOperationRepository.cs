using MotoManager.Domain.Entities;

namespace MotoManager.Application.Interfaces;

public interface IServiceOperationRepository
{
    Task<List<ServiceOperation>> GetAllAsync(CancellationToken ct);
    Task<ServiceOperation?> GetByIdAsync(long id, CancellationToken ct);
    Task AddAsync(ServiceOperation operation, CancellationToken ct);
    Task UpdateAsync(ServiceOperation operation, CancellationToken ct);
    Task<bool> DeleteAsync(long id, CancellationToken ct);
}
