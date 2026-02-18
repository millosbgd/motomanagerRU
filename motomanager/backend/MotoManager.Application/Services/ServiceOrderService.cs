using MotoManager.Application.DTOs;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;
using MotoManager.Domain.Enums;

namespace MotoManager.Application.Services;

public class ServiceOrderService(
    IServiceOrderRepository orderRepository,
    IVehicleRepository vehicleRepository) : IServiceOrderService
{
    public async Task<List<ServiceOrderDto>> GetAllAsync(CancellationToken ct)
    {
        var orders = await orderRepository.GetAllAsync(ct);
        return orders.Select(MapToDto).ToList();
    }

    public async Task<ServiceOrderDto?> GetByIdAsync(long id, CancellationToken ct)
    {
        var order = await orderRepository.GetByIdAsync(id, ct);
        return order is null ? null : MapToDto(order);
    }

    public async Task<ServiceOrderDto> CreateAsync(CreateServiceOrderRequest request, CancellationToken ct)
    {
        var vehicle = await vehicleRepository.GetByIdAsync(request.VehicleId, ct);
        if (vehicle is null || !vehicle.IsActive)
        {
            throw new InvalidOperationException("Vehicle not found or inactive.");
        }

        var order = new ServiceOrder
        {
            VehicleId = request.VehicleId,
            Description = request.Description,
            Status = ServiceOrderStatus.Open,
            OpenedAt = DateTimeOffset.UtcNow
        };

        await orderRepository.AddAsync(order, ct);
        return MapToDto(order);
    }

    public async Task<ServiceOrderDto?> UpdateAsync(long id, UpdateServiceOrderRequest request, CancellationToken ct)
    {
        var order = await orderRepository.GetByIdAsync(id, ct);
        if (order is null)
        {
            return null;
        }

        order.Description = request.Description;
        order.Status = request.Status;

        if (request.Status == ServiceOrderStatus.Closed && order.ClosedAt is null)
        {
            order.ClosedAt = DateTimeOffset.UtcNow;
        }

        await orderRepository.UpdateAsync(order, ct);
        return MapToDto(order);
    }

    public async Task<ServiceOrderDto?> CloseAsync(long id, CancellationToken ct)
    {
        var order = await orderRepository.GetByIdAsync(id, ct);
        if (order is null)
        {
            return null;
        }

        order.Status = ServiceOrderStatus.Closed;
        order.ClosedAt ??= DateTimeOffset.UtcNow;

        await orderRepository.UpdateAsync(order, ct);
        return MapToDto(order);
    }

    private static ServiceOrderDto MapToDto(ServiceOrder order)
        => new(
            order.Id,
            order.VehicleId,
            order.Description,
            order.Status,
            order.OpenedAt,
            order.ClosedAt,
            order.CreatedAt,
            order.UpdatedAt
        );
}
