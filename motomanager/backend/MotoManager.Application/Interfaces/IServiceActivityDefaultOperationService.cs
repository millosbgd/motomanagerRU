using MotoManager.Application.DTOs;

namespace MotoManager.Application.Interfaces;

public interface IServiceActivityDefaultOperationService
{
    Task<List<ServiceActivityDefaultOperationDto>> GetByActivityAsync(long serviceActivityId, CancellationToken ct);
    Task<bool> AddToActivityAsync(long serviceActivityId, AddServiceActivityDefaultOperationRequest request, CancellationToken ct);
    Task<ServiceActivityDefaultOperationDto?> UpdateAsync(long id, UpdateServiceActivityDefaultOperationRequest request, CancellationToken ct);
    Task<bool> RemoveAsync(long id, CancellationToken ct);
}
