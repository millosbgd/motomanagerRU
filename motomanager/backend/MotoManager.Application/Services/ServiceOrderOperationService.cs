using MotoManager.Application.DTOs;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;

namespace MotoManager.Application.Services;

public class ServiceOrderOperationService(
    IServiceOrderOperationRepository repository,
    IServiceOperationRepository operationRepository) : IServiceOrderOperationService
{
    public async Task<List<ServiceOrderOperationDto>> GetByServiceOrderAsync(long serviceOrderId, CancellationToken ct)
    {
        var ops = await repository.GetByServiceOrderAsync(serviceOrderId, ct);
        return ops.Select(MapToDto).ToList();
    }

    public async Task<ServiceOrderOperationDto> AddAsync(long serviceOrderId, AddServiceOrderOperationRequest request, CancellationToken ct)
    {
        var operation = await operationRepository.GetByIdAsync(request.ServiceOperationId, ct)
            ?? throw new InvalidOperationException("Service operation not found.");

        var entry = new ServiceOrderOperation
        {
            ServiceOrderId = serviceOrderId,
            ServiceOperationId = request.ServiceOperationId,
            WorkHours = request.WorkHours,
            PricePerHour = request.PricePerHour,
            TotalPrice = request.WorkHours * request.PricePerHour
        };

        await repository.AddAsync(entry, ct);
        entry.ServiceOperation = operation;
        return MapToDto(entry);
    }

    public async Task<ServiceOrderOperationDto?> UpdateAsync(long id, UpdateServiceOrderOperationRequest request, CancellationToken ct)
    {
        var entry = await repository.GetByIdAsync(id, ct);
        if (entry is null) return null;

        entry.WorkHours = request.WorkHours;
        entry.PricePerHour = request.PricePerHour;
        entry.TotalPrice = request.WorkHours * request.PricePerHour;

        await repository.UpdateAsync(entry, ct);
        return MapToDto(entry);
    }

    public Task<bool> RemoveAsync(long id, CancellationToken ct)
        => repository.RemoveAsync(id, ct);

    private static ServiceOrderOperationDto MapToDto(ServiceOrderOperation e)
        => new(
            e.Id,
            e.ServiceOrderId,
            e.ServiceOperationId,
            e.ServiceOperation?.Name ?? string.Empty,
            e.WorkHours,
            e.PricePerHour,
            e.TotalPrice
        );
}
