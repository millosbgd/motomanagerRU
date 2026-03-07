using MotoManager.Application.DTOs;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;

namespace MotoManager.Application.Services;

public class CodebookService(ICodebookRepository repository) : ICodebookService
{
    public async Task<IEnumerable<CodebookEntryDto>> GetAllAsync(CancellationToken ct)
        => (await repository.GetAllAsync(ct)).Select(ToDto);

    public async Task<IEnumerable<CodebookEntryDto>> GetByEntityAsync(string entity, CancellationToken ct)
        => (await repository.GetByEntityAsync(entity, ct)).Select(ToDto);

    public async Task<CodebookEntryDto?> GetByIdAsync(long id, CancellationToken ct)
        => (await repository.GetByIdAsync(id, ct)) is { } e ? ToDto(e) : null;

    public async Task<CodebookEntryDto> CreateAsync(CreateCodebookEntryRequest request, CancellationToken ct)
    {
        var entry = new CodebookEntry
        {
            Entity = request.Entity.Trim(),
            Code = request.Code.Trim(),
            Name = request.Name.Trim(),
            SortOrder = request.SortOrder,
            IsActive = true
        };
        return ToDto(await repository.CreateAsync(entry, ct));
    }

    public async Task<CodebookEntryDto?> UpdateAsync(long id, UpdateCodebookEntryRequest request, CancellationToken ct)
    {
        var existing = await repository.GetByIdAsync(id, ct);
        if (existing is null) return null;

        existing.Code = request.Code.Trim();
        existing.Name = request.Name.Trim();
        existing.SortOrder = request.SortOrder;
        existing.IsActive = request.IsActive;

        return (await repository.UpdateAsync(existing, ct)) is { } updated ? ToDto(updated) : null;
    }

    public Task<bool> DeleteAsync(long id, CancellationToken ct)
        => repository.DeleteAsync(id, ct);

    private static CodebookEntryDto ToDto(CodebookEntry e) =>
        new(e.Id, e.Entity, e.Code, e.Name, e.SortOrder, e.IsActive);
}
