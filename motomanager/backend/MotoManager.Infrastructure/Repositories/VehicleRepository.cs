using Microsoft.EntityFrameworkCore;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;
using MotoManager.Infrastructure.Data;

namespace MotoManager.Infrastructure.Repositories;

public class VehicleRepository(MotoManagerDbContext dbContext) : IVehicleRepository
{
    public Task<List<Vehicle>> GetAllAsync(CancellationToken ct)
        => dbContext.Vehicles
            .FromSqlRaw("SELECT * FROM fn_get_all_vehicles()")
            .AsNoTracking()
            .Include(v => v.Client)
            .ToListAsync(ct);

    public Task<Vehicle?> GetByIdAsync(long id, CancellationToken ct)
        => dbContext.Vehicles
            .FromSqlInterpolated($"SELECT * FROM fn_get_vehicle_by_id({id})")
            .Include(v => v.Client)
            .FirstOrDefaultAsync(ct);

    public async Task AddAsync(Vehicle vehicle, CancellationToken ct)
    {
        dbContext.Vehicles.Add(vehicle);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Vehicle vehicle, CancellationToken ct)
    {
        dbContext.Vehicles.Update(vehicle);
        await dbContext.SaveChangesAsync(ct);
    }
}
