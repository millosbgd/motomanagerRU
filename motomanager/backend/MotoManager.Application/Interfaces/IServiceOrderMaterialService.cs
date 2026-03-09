using MotoManager.Application.DTOs;

namespace MotoManager.Application.Interfaces;

public interface IServiceOrderMaterialService
{
    Task<List<ServiceOrderMaterialDto>> GetByServiceOrderAsync(long serviceOrderId, CancellationToken ct);
    Task<ServiceOrderMaterialDto> AddAsync(long serviceOrderId, AddServiceOrderMaterialRequest request, CancellationToken ct);
    Task<ServiceOrderMaterialDto?> UpdateAsync(long id, UpdateServiceOrderMaterialRequest request, CancellationToken ct);
    Task<bool> RemoveAsync(long id, CancellationToken ct);
}
