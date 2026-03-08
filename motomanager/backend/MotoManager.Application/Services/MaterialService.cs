using MotoManager.Application.DTOs;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;

namespace MotoManager.Application.Services;

public class MaterialService(IMaterialRepository repository) : IMaterialService
{
    public async Task<List<MaterialDto>> GetAllAsync(CancellationToken ct)
    {
        var materials = await repository.GetAllAsync(ct);
        return materials.Select(MapToDto).ToList();
    }

    public async Task<MaterialDto?> GetByIdAsync(long id, CancellationToken ct)
    {
        var material = await repository.GetByIdAsync(id, ct);
        return material is null ? null : MapToDto(material);
    }

    public async Task<MaterialDto> CreateAsync(CreateMaterialRequest request, CancellationToken ct)
    {
        var material = new Material
        {
            Name = request.Name.Trim(),
            UnitOfMeasureId = request.UnitOfMeasureId,
            IsActive = true
        };

        await repository.AddAsync(material, ct);
        return MapToDto(material);
    }

    public async Task<MaterialDto?> UpdateAsync(long id, UpdateMaterialRequest request, CancellationToken ct)
    {
        var material = await repository.GetByIdAsync(id, ct);
        if (material is null) return null;

        material.Name = request.Name.Trim();
        material.UnitOfMeasureId = request.UnitOfMeasureId;
        material.IsActive = request.IsActive;

        await repository.UpdateAsync(material, ct);
        return MapToDto(material);
    }

    public Task<bool> DeleteAsync(long id, CancellationToken ct)
        => repository.DeleteAsync(id, ct);

    private static MaterialDto MapToDto(Material m)
        => new(
            m.Id,
            m.Name,
            m.UnitOfMeasureId,
            m.UnitOfMeasure?.Name,
            m.IsActive,
            m.CreatedAt,
            m.UpdatedAt
        );
}
