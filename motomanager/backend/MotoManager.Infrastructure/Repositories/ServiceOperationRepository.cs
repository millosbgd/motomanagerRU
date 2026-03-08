using Microsoft.EntityFrameworkCore;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;
using MotoManager.Infrastructure.Data;

namespace MotoManager.Infrastructure.Repositories;

public class ServiceOperationRepository(MotoManagerDbContext dbContext) : IServiceOperationRepository
{
    public Task<List<ServiceOperation>> GetAllAsync(CancellationToken ct)
        => dbContext.ServiceOperations
            .FromSqlRaw("SELECT * FROM fn_get_all_service_operations()")
            .AsNoTracking()
            .ToListAsync(ct);

    public Task<ServiceOperation?> GetByIdAsync(long id, CancellationToken ct)
        => dbContext.ServiceOperations
            .FromSqlInterpolated($"SELECT * FROM fn_get_service_operation_by_id({id})")
            .FirstOrDefaultAsync(ct);

    public async Task AddAsync(ServiceOperation operation, CancellationToken ct)
    {
        dbContext.ServiceOperations.Add(operation);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(ServiceOperation operation, CancellationToken ct)
    {
        dbContext.ServiceOperations.Update(operation);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task<bool> DeleteAsync(long id, CancellationToken ct)
    {
        var operation = await GetByIdAsync(id, ct);
        if (operation is null) return false;

        dbContext.ServiceOperations.Remove(operation);
        await dbContext.SaveChangesAsync(ct);
        return true;
    }
}
