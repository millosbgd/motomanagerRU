using MotoManager.Application.DTOs;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;

namespace MotoManager.Application.Services;

public class VehicleService(IVehicleRepository repository) : IVehicleService
{
    public async Task<List<VehicleDto>> GetAllAsync(CancellationToken ct)
    {
        var vehicles = await repository.GetAllAsync(ct);
        return vehicles
            .Where(v => v.IsActive)
            .Select(MapToDto)
            .ToList();
    }

    public async Task<VehicleDto?> GetByIdAsync(long id, CancellationToken ct)
    {
        var vehicle = await repository.GetByIdAsync(id, ct);
        if (vehicle is null || !vehicle.IsActive)
        {
            return null;
        }

        return MapToDto(vehicle);
    }

    public async Task<VehicleDto> CreateAsync(CreateVehicleRequest request, CancellationToken ct)
    {
        var vehicle = new Vehicle
        {
            Registration = request.Registration,
            Make = request.Make,
            Model = request.Model,
            Year = request.Year,
            IsActive = true
        };

        await repository.AddAsync(vehicle, ct);
        return MapToDto(vehicle);
    }

    public async Task<VehicleDto?> UpdateAsync(long id, UpdateVehicleRequest request, CancellationToken ct)
    {
        var vehicle = await repository.GetByIdAsync(id, ct);
        if (vehicle is null)
        {
            return null;
        }

        vehicle.Registration = request.Registration;
        vehicle.Make = request.Make;
        vehicle.Model = request.Model;
        vehicle.Year = request.Year;
        vehicle.IsActive = request.IsActive;

        await repository.UpdateAsync(vehicle, ct);
        return MapToDto(vehicle);
    }

    public async Task<bool> SoftDeleteAsync(long id, CancellationToken ct)
    {
        var vehicle = await repository.GetByIdAsync(id, ct);
        if (vehicle is null)
        {
            return false;
        }

        vehicle.IsActive = false;
        await repository.UpdateAsync(vehicle, ct);
        return true;
    }

    private static VehicleDto MapToDto(Vehicle vehicle)
        => new(
            vehicle.Id,
            vehicle.Registration,
            vehicle.Make,
            vehicle.Model,
            vehicle.Year,
            vehicle.IsActive,
            vehicle.CreatedAt,
            vehicle.UpdatedAt
        );
}
