using MotoManager.Application.DTOs;

namespace MotoManager.Application.Interfaces;

public interface IServiceActivityDefaultMaterialService
{
    Task<List<ServiceActivityDefaultMaterialDto>> GetByActivityAsync(long serviceActivityId, CancellationToken ct);
    Task<bool> AddToActivityAsync(long serviceActivityId, AddServiceActivityDefaultMaterialRequest request, CancellationToken ct);
    Task<ServiceActivityDefaultMaterialDto?> UpdateAsync(long id, UpdateServiceActivityDefaultMaterialRequest request, CancellationToken ct);
    Task<bool> RemoveAsync(long id, CancellationToken ct);
}
