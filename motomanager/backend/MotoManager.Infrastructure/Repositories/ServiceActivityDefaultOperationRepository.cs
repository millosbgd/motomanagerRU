using Microsoft.EntityFrameworkCore;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;
using MotoManager.Infrastructure.Data;

namespace MotoManager.Infrastructure.Repositories;

public class ServiceActivityDefaultOperationRepository(MotoManagerDbContext dbContext)
    : IServiceActivityDefaultOperationRepository
{
    public Task<List<ServiceActivityDefaultOperation>> GetByActivityAsync(long serviceActivityId, CancellationToken ct)
        => dbContext.ServiceActivityDefaultOperations
            .FromSqlInterpolated($"SELECT * FROM fn_get_default_operations_by_activity({serviceActivityId})")
            .AsNoTracking()
            .Include(x => x.ServiceOperation)
            .ToListAsync(ct);

    public Task<ServiceActivityDefaultOperation?> GetByIdAsync(long id, CancellationToken ct)
        => dbContext.ServiceActivityDefaultOperations
            .Include(x => x.ServiceOperation)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<bool> AddToActivityAsync(ServiceActivityDefaultOperation entry, CancellationToken ct)
    {
        var exists = await dbContext.ServiceActivityDefaultOperations
            .AnyAsync(x => x.ServiceActivityId == entry.ServiceActivityId && x.ServiceOperationId == entry.ServiceOperationId, ct);
        if (exists) return false;

        dbContext.ServiceActivityDefaultOperations.Add(entry);
        await dbContext.SaveChangesAsync(ct);
        return true;
    }

    public async Task UpdateAsync(ServiceActivityDefaultOperation entry, CancellationToken ct)
    {
        dbContext.ServiceActivityDefaultOperations.Update(entry);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task<bool> RemoveAsync(long id, CancellationToken ct)
    {
        var entry = await dbContext.ServiceActivityDefaultOperations.FindAsync([id], ct);
        if (entry is null) return false;

        dbContext.ServiceActivityDefaultOperations.Remove(entry);
        await dbContext.SaveChangesAsync(ct);
        return true;
    }
}
