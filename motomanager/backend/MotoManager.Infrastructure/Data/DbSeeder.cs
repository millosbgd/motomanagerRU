using Microsoft.EntityFrameworkCore;
using MotoManager.Domain.Entities;
using MotoManager.Domain.Enums;

namespace MotoManager.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(MotoManagerDbContext dbContext, CancellationToken ct)
    {
        if (!await dbContext.UnitOfMeasures.AnyAsync(ct))
        {
            dbContext.UnitOfMeasures.AddRange(
                new UnitOfMeasure { Name = "Kom", IsActive = true },
                new UnitOfMeasure { Name = "Lit", IsActive = true },
                new UnitOfMeasure { Name = "Set", IsActive = true },
                new UnitOfMeasure { Name = "Kg", IsActive = true },
                new UnitOfMeasure { Name = "gr", IsActive = true }
            );

            await dbContext.SaveChangesAsync(ct);
        }

        if (await dbContext.Vehicles.AnyAsync(ct))
        {
            return;
        }

        var vehicle = new Vehicle
        {
            Registration = "MM-TEST-001",
            Make = "Yamaha",
            Model = "MT-07",
            Year = 2022,
            IsActive = true
        };

        dbContext.Vehicles.Add(vehicle);
        await dbContext.SaveChangesAsync(ct);

        var order = new ServiceOrder
        {
            VehicleId = vehicle.Id,
            Description = "Redovan servis",
            Status = ServiceOrderStatus.Open,
            OpenedAt = DateTimeOffset.UtcNow
        };

        dbContext.ServiceOrders.Add(order);
        await dbContext.SaveChangesAsync(ct);
    }
}
