using MotoManager.Application.DTOs;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;

namespace MotoManager.Application.Services;

public class ServiceActivityDefaultsApplyService(
    IServiceActivityDefaultOperationRepository defaultOperationRepository,
    IServiceActivityDefaultMaterialRepository defaultMaterialRepository,
    IServiceOrderOperationRepository orderOperationRepository,
    IServiceOrderMaterialRepository orderMaterialRepository) : IServiceActivityDefaultsApplyService
{
    public async Task<ApplyActivityDefaultsResult> ApplyToOrderAsync(long serviceOrderId, long serviceActivityId, CancellationToken ct)
    {
        var defaultOps = await defaultOperationRepository.GetByActivityAsync(serviceActivityId, ct);
        var defaultMats = await defaultMaterialRepository.GetByActivityAsync(serviceActivityId, ct);

        var operationsAdded = 0;
        foreach (var op in defaultOps)
        {
            if (await orderOperationRepository.ExistsAsync(serviceOrderId, op.ServiceOperationId, ct))
            {
                continue;
            }

            var entry = new ServiceOrderOperation
            {
                ServiceOrderId = serviceOrderId,
                ServiceOperationId = op.ServiceOperationId,
                WorkHours = op.WorkHours,
                PricePerHour = 0,
                TotalPrice = 0
            };

            await orderOperationRepository.AddAsync(entry, ct);
            operationsAdded++;
        }

        var materialsAdded = 0;
        foreach (var mat in defaultMats)
        {
            if (await orderMaterialRepository.ExistsAsync(serviceOrderId, mat.MaterialId, ct))
            {
                continue;
            }

            var entry = new ServiceOrderMaterial
            {
                ServiceOrderId = serviceOrderId,
                MaterialId = mat.MaterialId,
                Quantity = mat.Quantity,
                PricePerUnit = 0,
                TotalPrice = 0
            };

            await orderMaterialRepository.AddAsync(entry, ct);
            materialsAdded++;
        }

        return new ApplyActivityDefaultsResult(operationsAdded, materialsAdded);
    }
}
