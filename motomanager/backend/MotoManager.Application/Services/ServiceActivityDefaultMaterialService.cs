using MotoManager.Application.DTOs;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;

namespace MotoManager.Application.Services;

public class ServiceActivityDefaultMaterialService(
    IServiceActivityDefaultMaterialRepository repository,
    IMaterialRepository materialRepository) : IServiceActivityDefaultMaterialService
{
    public async Task<List<ServiceActivityDefaultMaterialDto>> GetByActivityAsync(long serviceActivityId, CancellationToken ct)
    {
        var items = await repository.GetByActivityAsync(serviceActivityId, ct);
        return items.Select(MapToDto).ToList();
    }

    public async Task<bool> AddToActivityAsync(long serviceActivityId, AddServiceActivityDefaultMaterialRequest request, CancellationToken ct)
    {
        var material = await materialRepository.GetByIdAsync(request.MaterialId, ct)
            ?? throw new InvalidOperationException("Material not found.");

        var entry = new ServiceActivityDefaultMaterial
        {
            ServiceActivityId = serviceActivityId,
            MaterialId = request.MaterialId,
            Quantity = request.Quantity
        };

        var created = await repository.AddToActivityAsync(entry, ct);
        if (!created) return false;

        entry.Material = material;
        return true;
    }

    public async Task<ServiceActivityDefaultMaterialDto?> UpdateAsync(long id, UpdateServiceActivityDefaultMaterialRequest request, CancellationToken ct)
    {
        var entry = await repository.GetByIdAsync(id, ct);
        if (entry is null) return null;

        entry.Quantity = request.Quantity;
        await repository.UpdateAsync(entry, ct);
        return MapToDto(entry);
    }

    public Task<bool> RemoveAsync(long id, CancellationToken ct)
        => repository.RemoveAsync(id, ct);

    private static ServiceActivityDefaultMaterialDto MapToDto(ServiceActivityDefaultMaterial e)
        => new(
            e.Id,
            e.ServiceActivityId,
            e.MaterialId,
            e.Material?.Name ?? string.Empty,
            e.Material?.UnitOfMeasure?.Name,
            e.Quantity
        );
}
