using MotoManager.Domain.Enums;

namespace MotoManager.Domain.Entities;

public class ServiceOrder
{
    public long Id { get; set; }
    public long VehicleId { get; set; }
    public string Description { get; set; } = string.Empty;
    public ServiceOrderStatus Status { get; set; } = ServiceOrderStatus.Open;
    public DateTimeOffset OpenedAt { get; set; }
    public DateTimeOffset? ClosedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public Vehicle? Vehicle { get; set; }
}
