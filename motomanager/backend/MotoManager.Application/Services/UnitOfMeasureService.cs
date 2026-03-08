using MotoManager.Application.DTOs;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;

namespace MotoManager.Application.Services;

public class UnitOfMeasureService(IUnitOfMeasureRepository repository) : IUnitOfMeasureService
{
    public async Task<List<UnitOfMeasureDto>> GetAllAsync(CancellationToken ct)
    {
        var units = await repository.GetAllAsync(ct);
        return units.Select(MapToDto).ToList();
    }

    public async Task<UnitOfMeasureDto?> GetByIdAsync(long id, CancellationToken ct)
    {
        var unit = await repository.GetByIdAsync(id, ct);
        return unit is null ? null : MapToDto(unit);
    }

    public async Task<UnitOfMeasureDto> CreateAsync(CreateUnitOfMeasureRequest request, CancellationToken ct)
    {
        var unit = new UnitOfMeasure { Name = request.Name.Trim(), IsActive = true };
        await repository.AddAsync(unit, ct);
        return MapToDto(unit);
    }

    public async Task<UnitOfMeasureDto?> UpdateAsync(long id, UpdateUnitOfMeasureRequest request, CancellationToken ct)
    {
        var unit = await repository.GetByIdAsync(id, ct);
        if (unit is null) return null;

        unit.Name = request.Name.Trim();
        unit.IsActive = request.IsActive;

        await repository.UpdateAsync(unit, ct);
        return MapToDto(unit);
    }

    public Task<bool> DeleteAsync(long id, CancellationToken ct)
        => repository.DeleteAsync(id, ct);

    private static UnitOfMeasureDto MapToDto(UnitOfMeasure u)
        => new(u.Id, u.Name, u.IsActive, u.CreatedAt, u.UpdatedAt);
}
