using Microsoft.EntityFrameworkCore;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;
using MotoManager.Infrastructure.Data;

namespace MotoManager.Infrastructure.Repositories;

public class UnitOfMeasureRepository(MotoManagerDbContext dbContext) : IUnitOfMeasureRepository
{
    public Task<List<UnitOfMeasure>> GetAllAsync(CancellationToken ct)
        => dbContext.UnitOfMeasures
            .FromSqlRaw("SELECT * FROM fn_get_all_unit_of_measures()")
            .AsNoTracking()
            .ToListAsync(ct);

    public Task<UnitOfMeasure?> GetByIdAsync(long id, CancellationToken ct)
        => dbContext.UnitOfMeasures
            .FromSqlInterpolated($"SELECT * FROM fn_get_unit_of_measure_by_id({id})")
            .FirstOrDefaultAsync(ct);

    public async Task AddAsync(UnitOfMeasure unitOfMeasure, CancellationToken ct)
    {
        dbContext.UnitOfMeasures.Add(unitOfMeasure);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(UnitOfMeasure unitOfMeasure, CancellationToken ct)
    {
        dbContext.UnitOfMeasures.Update(unitOfMeasure);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task<bool> DeleteAsync(long id, CancellationToken ct)
    {
        var unit = await GetByIdAsync(id, ct);
        if (unit is null) return false;

        dbContext.UnitOfMeasures.Remove(unit);
        await dbContext.SaveChangesAsync(ct);
        return true;
    }
}
