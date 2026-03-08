using Microsoft.EntityFrameworkCore;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;
using MotoManager.Infrastructure.Data;

namespace MotoManager.Infrastructure.Repositories;

public class CodebookRepository(MotoManagerDbContext db) : ICodebookRepository
{
    public async Task<IEnumerable<CodebookEntry>> GetAllAsync(CancellationToken ct)
        => await db.CodebookEntries
            .FromSqlRaw("SELECT * FROM fn_get_all_codebook_entries()")
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<IEnumerable<CodebookEntry>> GetByEntityAsync(string entity, CancellationToken ct)
        => await db.CodebookEntries
            .FromSqlInterpolated($"SELECT * FROM fn_get_codebook_by_entity({entity})")
            .AsNoTracking()
            .ToListAsync(ct);

    public Task<CodebookEntry?> GetByIdAsync(long id, CancellationToken ct)
        => db.CodebookEntries
            .FromSqlInterpolated($"SELECT * FROM fn_get_codebook_entry_by_id({id})")
            .FirstOrDefaultAsync(ct);

    public async Task<CodebookEntry> CreateAsync(CodebookEntry entry, CancellationToken ct)
    {
        db.CodebookEntries.Add(entry);
        await db.SaveChangesAsync(ct);
        return entry;
    }

    public async Task<CodebookEntry?> UpdateAsync(CodebookEntry entry, CancellationToken ct)
    {
        db.CodebookEntries.Update(entry);
        await db.SaveChangesAsync(ct);
        return entry;
    }

    public async Task<bool> DeleteAsync(long id, CancellationToken ct)
    {
        var entry = await GetByIdAsync(id, ct);
        if (entry is null) return false;
        db.CodebookEntries.Remove(entry);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
