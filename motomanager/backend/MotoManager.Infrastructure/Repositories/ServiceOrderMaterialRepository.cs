using Microsoft.EntityFrameworkCore;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;
using MotoManager.Infrastructure.Data;

namespace MotoManager.Infrastructure.Repositories;

public class ServiceOrderMaterialRepository(MotoManagerDbContext dbContext) : IServiceOrderMaterialRepository
{
    public Task<List<ServiceOrderMaterial>> GetByServiceOrderAsync(long serviceOrderId, CancellationToken ct)
        => dbContext.ServiceOrderMaterials
            .FromSqlInterpolated($"SELECT * FROM fn_get_materials_by_service_order({serviceOrderId})")
            .AsNoTracking()
            .Include(m => m.Material)
                .ThenInclude(m => m!.UnitOfMeasure)
            .ToListAsync(ct);

    public Task<ServiceOrderMaterial?> GetByIdAsync(long id, CancellationToken ct)
        => dbContext.ServiceOrderMaterials
            .Include(m => m.Material)
                .ThenInclude(m => m!.UnitOfMeasure)
            .FirstOrDefaultAsync(m => m.Id == id, ct);

    public Task<bool> ExistsAsync(long serviceOrderId, long materialId, CancellationToken ct)
        => dbContext.ServiceOrderMaterials
            .AnyAsync(m => m.ServiceOrderId == serviceOrderId && m.MaterialId == materialId, ct);

    public async Task AddAsync(ServiceOrderMaterial material, CancellationToken ct)
    {
        dbContext.ServiceOrderMaterials.Add(material);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(ServiceOrderMaterial material, CancellationToken ct)
    {
        dbContext.ServiceOrderMaterials.Update(material);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task<bool> RemoveAsync(long id, CancellationToken ct)
    {
        var entry = await dbContext.ServiceOrderMaterials.FindAsync([id], ct);
        if (entry is null) return false;

        dbContext.ServiceOrderMaterials.Remove(entry);
        await dbContext.SaveChangesAsync(ct);
        return true;
    }
}
