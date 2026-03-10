using MotoManager.Application.DTOs;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;

namespace MotoManager.Application.Services;

public class ServiceActivityDefaultOperationService(
    IServiceActivityDefaultOperationRepository repository,
    IServiceOperationRepository operationRepository) : IServiceActivityDefaultOperationService
{
    public async Task<List<ServiceActivityDefaultOperationDto>> GetByActivityAsync(long serviceActivityId, CancellationToken ct)
    {
        var items = await repository.GetByActivityAsync(serviceActivityId, ct);
        return items.Select(MapToDto).ToList();
    }

    public async Task<bool> AddToActivityAsync(long serviceActivityId, AddServiceActivityDefaultOperationRequest request, CancellationToken ct)
    {
        var operation = await operationRepository.GetByIdAsync(request.ServiceOperationId, ct)
            ?? throw new InvalidOperationException("Service operation not found.");

        var entry = new ServiceActivityDefaultOperation
        {
            ServiceActivityId = serviceActivityId,
            ServiceOperationId = request.ServiceOperationId,
            WorkHours = request.WorkHours
        };

        var created = await repository.AddToActivityAsync(entry, ct);
        if (!created) return false;

        entry.ServiceOperation = operation;
        return true;
    }

    public async Task<ServiceActivityDefaultOperationDto?> UpdateAsync(long id, UpdateServiceActivityDefaultOperationRequest request, CancellationToken ct)
    {
        var entry = await repository.GetByIdAsync(id, ct);
        if (entry is null) return null;

        entry.WorkHours = request.WorkHours;
        await repository.UpdateAsync(entry, ct);
        return MapToDto(entry);
    }

    public Task<bool> RemoveAsync(long id, CancellationToken ct)
        => repository.RemoveAsync(id, ct);

    private static ServiceActivityDefaultOperationDto MapToDto(ServiceActivityDefaultOperation e)
        => new(
            e.Id,
            e.ServiceActivityId,
            e.ServiceOperationId,
            e.ServiceOperation?.Name ?? string.Empty,
            e.WorkHours
        );
}
