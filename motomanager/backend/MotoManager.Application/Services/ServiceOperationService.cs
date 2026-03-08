using MotoManager.Application.DTOs;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;

namespace MotoManager.Application.Services;

public class ServiceOperationService(IServiceOperationRepository repository) : IServiceOperationService
{
    public async Task<List<ServiceOperationDto>> GetAllAsync(CancellationToken ct)
    {
        var items = await repository.GetAllAsync(ct);
        return items.Select(MapToDto).ToList();
    }

    public async Task<ServiceOperationDto?> GetByIdAsync(long id, CancellationToken ct)
    {
        var item = await repository.GetByIdAsync(id, ct);
        return item is null ? null : MapToDto(item);
    }

    public async Task<ServiceOperationDto> CreateAsync(CreateServiceOperationRequest request, CancellationToken ct)
    {
        var operation = new ServiceOperation
        {
            Name = request.Name.Trim(),
            WorkHours = request.WorkHours,
            IsActive = true
        };

        await repository.AddAsync(operation, ct);
        return MapToDto(operation);
    }

    public async Task<ServiceOperationDto?> UpdateAsync(long id, UpdateServiceOperationRequest request, CancellationToken ct)
    {
        var operation = await repository.GetByIdAsync(id, ct);
        if (operation is null) return null;

        operation.Name = request.Name.Trim();
        operation.WorkHours = request.WorkHours;
        operation.IsActive = request.IsActive;

        await repository.UpdateAsync(operation, ct);
        return MapToDto(operation);
    }

    public Task<bool> DeleteAsync(long id, CancellationToken ct)
        => repository.DeleteAsync(id, ct);

    private static ServiceOperationDto MapToDto(ServiceOperation o)
        => new(o.Id, o.Name, o.WorkHours, o.IsActive, o.CreatedAt, o.UpdatedAt);
}
