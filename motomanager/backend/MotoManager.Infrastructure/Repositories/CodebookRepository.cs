using Microsoft.EntityFrameworkCore;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;
using MotoManager.Infrastructure.Data;

namespace MotoManager.Infrastructure.Repositories;

public class CodebookRepository(MotoManagerDbContext db) : ICodebookRepository
{
    public async Task<IEnumerable<CodebookEntry>> GetAllAsync(CancellationToken ct)
        => await db.CodebookEntries
            .OrderBy(e => e.Entity)
            .ThenBy(e => e.SortOrder)
            .ThenBy(e => e.Name)
            .ToListAsync(ct);

    public async Task<IEnumerable<CodebookEntry>> GetByEntityAsync(string entity, CancellationToken ct)
        => await db.CodebookEntries
            .Where(e => e.Entity == entity)
            .OrderBy(e => e.SortOrder)
            .ThenBy(e => e.Name)
            .ToListAsync(ct);

    public Task<CodebookEntry?> GetByIdAsync(long id, CancellationToken ct)
        => db.CodebookEntries.FirstOrDefaultAsync(e => e.Id == id, ct);

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
        var entry = await db.CodebookEntries.FindAsync([id], ct);
        if (entry is null) return false;
        db.CodebookEntries.Remove(entry);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
