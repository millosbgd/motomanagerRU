using MotoManager.Application.DTOs;

namespace MotoManager.Application.Interfaces;

public interface ICodebookService
{
    Task<IEnumerable<CodebookEntryDto>> GetAllAsync(CancellationToken ct);
    Task<IEnumerable<CodebookEntryDto>> GetByEntityAsync(string entity, CancellationToken ct);
    Task<CodebookEntryDto?> GetByIdAsync(long id, CancellationToken ct);
    Task<CodebookEntryDto> CreateAsync(CreateCodebookEntryRequest request, CancellationToken ct);
    Task<CodebookEntryDto?> UpdateAsync(long id, UpdateCodebookEntryRequest request, CancellationToken ct);
    Task<bool> DeleteAsync(long id, CancellationToken ct);
}
