using MotoManager.Domain.Entities;

namespace MotoManager.Application.Interfaces;

public interface IVehicleRepository
{
    Task<List<Vehicle>> GetAllAsync(CancellationToken ct);
    Task<Vehicle?> GetByIdAsync(long id, CancellationToken ct);
    Task AddAsync(Vehicle vehicle, CancellationToken ct);
    Task UpdateAsync(Vehicle vehicle, CancellationToken ct);
}
