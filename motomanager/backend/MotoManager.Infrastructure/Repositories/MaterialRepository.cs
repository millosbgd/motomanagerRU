using Microsoft.EntityFrameworkCore;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;
using MotoManager.Infrastructure.Data;

namespace MotoManager.Infrastructure.Repositories;

public class MaterialRepository(MotoManagerDbContext dbContext) : IMaterialRepository
{
    public Task<List<Material>> GetAllAsync(CancellationToken ct)
        => dbContext.Materials
            .FromSqlRaw("SELECT * FROM fn_get_all_materials()")
            .AsNoTracking()
            .Include(m => m.UnitOfMeasure)
            .ToListAsync(ct);

    public Task<Material?> GetByIdAsync(long id, CancellationToken ct)
        => dbContext.Materials
            .FromSqlInterpolated($"SELECT * FROM fn_get_material_by_id({id})")
            .Include(m => m.UnitOfMeasure)
            .FirstOrDefaultAsync(ct);

    public async Task AddAsync(Material material, CancellationToken ct)
    {
        dbContext.Materials.Add(material);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Material material, CancellationToken ct)
    {
        dbContext.Materials.Update(material);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task<bool> DeleteAsync(long id, CancellationToken ct)
    {
        var material = await GetByIdAsync(id, ct);
        if (material is null) return false;

        dbContext.Materials.Remove(material);
        await dbContext.SaveChangesAsync(ct);
        return true;
    }
}
