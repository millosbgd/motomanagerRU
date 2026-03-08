using MotoManager.Application.DTOs;

namespace MotoManager.Application.Interfaces;

public interface IServiceOperationService
{
    Task<List<ServiceOperationDto>> GetAllAsync(CancellationToken ct);
    Task<ServiceOperationDto?> GetByIdAsync(long id, CancellationToken ct);
    Task<ServiceOperationDto> CreateAsync(CreateServiceOperationRequest request, CancellationToken ct);
    Task<ServiceOperationDto?> UpdateAsync(long id, UpdateServiceOperationRequest request, CancellationToken ct);
    Task<bool> DeleteAsync(long id, CancellationToken ct);
}
