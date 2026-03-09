using MotoManager.Application.DTOs;

namespace MotoManager.Application.Interfaces;

public interface IServiceOrderOperationService
{
    Task<List<ServiceOrderOperationDto>> GetByServiceOrderAsync(long serviceOrderId, CancellationToken ct);
    Task<ServiceOrderOperationDto> AddAsync(long serviceOrderId, AddServiceOrderOperationRequest request, CancellationToken ct);
    Task<ServiceOrderOperationDto?> UpdateAsync(long id, UpdateServiceOrderOperationRequest request, CancellationToken ct);
    Task<bool> RemoveAsync(long id, CancellationToken ct);
}
