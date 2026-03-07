using MotoManager.Domain.Entities;

namespace MotoManager.Application.Interfaces;

public interface ICodebookRepository
{
    Task<IEnumerable<CodebookEntry>> GetAllAsync(CancellationToken ct);
    Task<IEnumerable<CodebookEntry>> GetByEntityAsync(string entity, CancellationToken ct);
    Task<CodebookEntry?> GetByIdAsync(long id, CancellationToken ct);
    Task<CodebookEntry> CreateAsync(CodebookEntry entry, CancellationToken ct);
    Task<CodebookEntry?> UpdateAsync(CodebookEntry entry, CancellationToken ct);
    Task<bool> DeleteAsync(long id, CancellationToken ct);
}
