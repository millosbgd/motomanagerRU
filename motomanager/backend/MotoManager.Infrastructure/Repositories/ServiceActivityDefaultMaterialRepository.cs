using Microsoft.EntityFrameworkCore;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;
using MotoManager.Infrastructure.Data;

namespace MotoManager.Infrastructure.Repositories;

public class ServiceActivityDefaultMaterialRepository(MotoManagerDbContext dbContext)
    : IServiceActivityDefaultMaterialRepository
{
    public Task<List<ServiceActivityDefaultMaterial>> GetByActivityAsync(long serviceActivityId, CancellationToken ct)
        => dbContext.ServiceActivityDefaultMaterials
            .FromSqlInterpolated($"SELECT * FROM fn_get_default_materials_by_activity({serviceActivityId})")
            .AsNoTracking()
            .Include(x => x.Material)
                .ThenInclude(m => m!.UnitOfMeasure)
            .ToListAsync(ct);

    public Task<ServiceActivityDefaultMaterial?> GetByIdAsync(long id, CancellationToken ct)
        => dbContext.ServiceActivityDefaultMaterials
            .Include(x => x.Material)
                .ThenInclude(m => m!.UnitOfMeasure)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<bool> AddToActivityAsync(ServiceActivityDefaultMaterial entry, CancellationToken ct)
    {
        var exists = await dbContext.ServiceActivityDefaultMaterials
            .AnyAsync(x => x.ServiceActivityId == entry.ServiceActivityId && x.MaterialId == entry.MaterialId, ct);
        if (exists) return false;

        dbContext.ServiceActivityDefaultMaterials.Add(entry);
        await dbContext.SaveChangesAsync(ct);
        return true;
    }

    public async Task UpdateAsync(ServiceActivityDefaultMaterial entry, CancellationToken ct)
    {
        dbContext.ServiceActivityDefaultMaterials.Update(entry);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task<bool> RemoveAsync(long id, CancellationToken ct)
    {
        var entry = await dbContext.ServiceActivityDefaultMaterials.FindAsync([id], ct);
        if (entry is null) return false;

        dbContext.ServiceActivityDefaultMaterials.Remove(entry);
        await dbContext.SaveChangesAsync(ct);
        return true;
    }
}
