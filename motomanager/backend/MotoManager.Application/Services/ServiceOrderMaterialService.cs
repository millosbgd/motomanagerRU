using MotoManager.Application.DTOs;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;

namespace MotoManager.Application.Services;

public class ServiceOrderMaterialService(
    IServiceOrderMaterialRepository repository,
    IMaterialRepository materialRepository) : IServiceOrderMaterialService
{
    public async Task<List<ServiceOrderMaterialDto>> GetByServiceOrderAsync(long serviceOrderId, CancellationToken ct)
    {
        var items = await repository.GetByServiceOrderAsync(serviceOrderId, ct);
        return items.Select(MapToDto).ToList();
    }

    public async Task<ServiceOrderMaterialDto> AddAsync(long serviceOrderId, AddServiceOrderMaterialRequest request, CancellationToken ct)
    {
        var material = await materialRepository.GetByIdAsync(request.MaterialId, ct)
            ?? throw new InvalidOperationException("Material not found.");

        var entry = new ServiceOrderMaterial
        {
            ServiceOrderId = serviceOrderId,
            MaterialId = request.MaterialId,
            Quantity = request.Quantity,
            PricePerUnit = request.PricePerUnit,
            TotalPrice = request.Quantity * request.PricePerUnit
        };

        await repository.AddAsync(entry, ct);
        entry.Material = material;
        return MapToDto(entry);
    }

    public async Task<ServiceOrderMaterialDto?> UpdateAsync(long id, UpdateServiceOrderMaterialRequest request, CancellationToken ct)
    {
        var entry = await repository.GetByIdAsync(id, ct);
        if (entry is null) return null;

        entry.Quantity = request.Quantity;
        entry.PricePerUnit = request.PricePerUnit;
        entry.TotalPrice = request.Quantity * request.PricePerUnit;

        await repository.UpdateAsync(entry, ct);
        return MapToDto(entry);
    }

    public Task<bool> RemoveAsync(long id, CancellationToken ct)
        => repository.RemoveAsync(id, ct);

    private static ServiceOrderMaterialDto MapToDto(ServiceOrderMaterial e)
        => new(
            e.Id,
            e.ServiceOrderId,
            e.MaterialId,
            e.Material?.Name ?? string.Empty,
            e.Material?.UnitOfMeasure?.Name,
            e.Quantity,
            e.PricePerUnit,
            e.TotalPrice
        );
}
