using MotoManager.Application.DTOs;

namespace MotoManager.Application.Interfaces;

public interface IServiceActivityService
{
    Task<List<ServiceActivityDto>> GetAllAsync(CancellationToken ct);
    Task<ServiceActivityDto?> GetByIdAsync(long id, CancellationToken ct);
    Task<List<ServiceActivityDto>> GetByServiceOrderAsync(long serviceOrderId, CancellationToken ct);
    Task<ServiceActivityDto> CreateAsync(CreateServiceActivityRequest request, CancellationToken ct);
    Task<ServiceActivityDto?> UpdateAsync(long id, UpdateServiceActivityRequest request, CancellationToken ct);
    Task<bool> DeleteAsync(long id, CancellationToken ct);
    Task<bool> AddToOrderAsync(long serviceOrderId, long serviceActivityId, CancellationToken ct);
    Task<bool> RemoveFromOrderAsync(long serviceOrderId, long serviceActivityId, CancellationToken ct);
}
