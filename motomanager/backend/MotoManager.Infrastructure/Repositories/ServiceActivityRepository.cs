using Microsoft.EntityFrameworkCore;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;
using MotoManager.Infrastructure.Data;

namespace MotoManager.Infrastructure.Repositories;

public class ServiceActivityRepository(MotoManagerDbContext dbContext) : IServiceActivityRepository
{
    public Task<List<ServiceActivity>> GetAllAsync(CancellationToken ct)
        => dbContext.ServiceActivities
            .FromSqlRaw("SELECT * FROM fn_get_all_service_activities()")
            .AsNoTracking()
            .ToListAsync(ct);

    public Task<ServiceActivity?> GetByIdAsync(long id, CancellationToken ct)
        => dbContext.ServiceActivities
            .FromSqlInterpolated($"SELECT * FROM fn_get_service_activity_by_id({id})")
            .FirstOrDefaultAsync(ct);

    public Task<List<ServiceActivity>> GetByServiceOrderAsync(long serviceOrderId, CancellationToken ct)
        => dbContext.ServiceActivities
            .FromSqlInterpolated($"SELECT * FROM fn_get_activities_by_service_order({serviceOrderId})")
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task AddAsync(ServiceActivity activity, CancellationToken ct)
    {
        dbContext.ServiceActivities.Add(activity);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(ServiceActivity activity, CancellationToken ct)
    {
        dbContext.ServiceActivities.Update(activity);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task<bool> DeleteAsync(long id, CancellationToken ct)
    {
        var activity = await GetByIdAsync(id, ct);
        if (activity is null) return false;

        dbContext.ServiceActivities.Remove(activity);
        await dbContext.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> AddToOrderAsync(long serviceOrderId, long serviceActivityId, CancellationToken ct)
    {
        var exists = await dbContext.ServiceOrderActivities
            .AnyAsync(soa => soa.ServiceOrderId == serviceOrderId && soa.ServiceActivityId == serviceActivityId, ct);
        if (exists) return false;

        dbContext.ServiceOrderActivities.Add(new ServiceOrderActivity
        {
            ServiceOrderId = serviceOrderId,
            ServiceActivityId = serviceActivityId
        });
        await dbContext.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> RemoveFromOrderAsync(long serviceOrderId, long serviceActivityId, CancellationToken ct)
    {
        var row = await dbContext.ServiceOrderActivities
            .FirstOrDefaultAsync(soa => soa.ServiceOrderId == serviceOrderId && soa.ServiceActivityId == serviceActivityId, ct);
        if (row is null) return false;

        dbContext.ServiceOrderActivities.Remove(row);
        await dbContext.SaveChangesAsync(ct);
        return true;
    }
}
