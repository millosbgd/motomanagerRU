using MotoManager.Application.DTOs;

namespace MotoManager.Application.Interfaces;

public interface IServiceOrderService
{
    Task<List<ServiceOrderDto>> GetAllAsync(CancellationToken ct);
    Task<ServiceOrderDto?> GetByIdAsync(long id, CancellationToken ct);
    Task<ServiceOrderDto> CreateAsync(CreateServiceOrderRequest request, CancellationToken ct);
    Task<ServiceOrderDto?> UpdateAsync(long id, UpdateServiceOrderRequest request, CancellationToken ct);
    Task<ServiceOrderDto?> CloseAsync(long id, CancellationToken ct);
}
