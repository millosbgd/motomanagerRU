using MotoManager.Application.DTOs;

namespace MotoManager.Application.Interfaces;

public interface IVehicleService
{
    Task<List<VehicleDto>> GetAllAsync(CancellationToken ct);
    Task<VehicleDto?> GetByIdAsync(long id, CancellationToken ct);
    Task<VehicleDto> CreateAsync(CreateVehicleRequest request, CancellationToken ct);
    Task<VehicleDto?> UpdateAsync(long id, UpdateVehicleRequest request, CancellationToken ct);
    Task<bool> SoftDeleteAsync(long id, CancellationToken ct);
}
