using MotoManager.Application.DTOs;

namespace MotoManager.Application.Interfaces;

public interface IServiceActivityDefaultsApplyService
{
    Task<ApplyActivityDefaultsResult> ApplyToOrderAsync(long serviceOrderId, long serviceActivityId, CancellationToken ct);
}
