using Microsoft.EntityFrameworkCore;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;
using MotoManager.Infrastructure.Data;

namespace MotoManager.Infrastructure.Repositories;

public class ServiceOrderOperationRepository(MotoManagerDbContext dbContext) : IServiceOrderOperationRepository
{
    public Task<List<ServiceOrderOperation>> GetByServiceOrderAsync(long serviceOrderId, CancellationToken ct)
        => dbContext.ServiceOrderOperations
            .FromSqlInterpolated($"SELECT * FROM fn_get_operations_by_service_order({serviceOrderId})")
            .AsNoTracking()
            .Include(o => o.ServiceOperation)
            .ToListAsync(ct);

    public Task<ServiceOrderOperation?> GetByIdAsync(long id, CancellationToken ct)
        => dbContext.ServiceOrderOperations
            .Include(o => o.ServiceOperation)
            .FirstOrDefaultAsync(o => o.Id == id, ct);

    public async Task AddAsync(ServiceOrderOperation operation, CancellationToken ct)
    {
        dbContext.ServiceOrderOperations.Add(operation);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(ServiceOrderOperation operation, CancellationToken ct)
    {
        dbContext.ServiceOrderOperations.Update(operation);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task<bool> RemoveAsync(long id, CancellationToken ct)
    {
        var entry = await dbContext.ServiceOrderOperations.FindAsync([id], ct);
        if (entry is null) return false;

        dbContext.ServiceOrderOperations.Remove(entry);
        await dbContext.SaveChangesAsync(ct);
        return true;
    }
}
