using MotoManager.Application.DTOs;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;

namespace MotoManager.Application.Services;

public class ServiceActivityService(IServiceActivityRepository repository) : IServiceActivityService
{
    public async Task<List<ServiceActivityDto>> GetAllAsync(CancellationToken ct)
    {
        var activities = await repository.GetAllAsync(ct);
        return activities.Select(MapToDto).ToList();
    }

    public async Task<ServiceActivityDto?> GetByIdAsync(long id, CancellationToken ct)
    {
        var activity = await repository.GetByIdAsync(id, ct);
        return activity is null ? null : MapToDto(activity);
    }

    public async Task<List<ServiceActivityDto>> GetByServiceOrderAsync(long serviceOrderId, CancellationToken ct)
    {
        var activities = await repository.GetByServiceOrderAsync(serviceOrderId, ct);
        return activities.Select(MapToDto).ToList();
    }

    public async Task<ServiceActivityDto> CreateAsync(CreateServiceActivityRequest request, CancellationToken ct)
    {
        var activity = new ServiceActivity { Name = request.Name };
        await repository.AddAsync(activity, ct);
        return MapToDto(activity);
    }

    public async Task<ServiceActivityDto?> UpdateAsync(long id, UpdateServiceActivityRequest request, CancellationToken ct)
    {
        var activity = await repository.GetByIdAsync(id, ct);
        if (activity is null) return null;

        activity.Name = request.Name;
        activity.IsActive = request.IsActive;

        await repository.UpdateAsync(activity, ct);
        return MapToDto(activity);
    }

    public Task<bool> DeleteAsync(long id, CancellationToken ct)
        => repository.DeleteAsync(id, ct);

    public Task<bool> AddToOrderAsync(long serviceOrderId, long serviceActivityId, CancellationToken ct)
        => repository.AddToOrderAsync(serviceOrderId, serviceActivityId, ct);

    public Task<bool> RemoveFromOrderAsync(long serviceOrderId, long serviceActivityId, CancellationToken ct)
        => repository.RemoveFromOrderAsync(serviceOrderId, serviceActivityId, ct);

    private static ServiceActivityDto MapToDto(ServiceActivity a)
        => new(a.Id, a.Name, a.IsActive, a.CreatedAt, a.UpdatedAt);
}
