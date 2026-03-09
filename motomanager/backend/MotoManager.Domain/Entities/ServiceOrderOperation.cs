namespace MotoManager.Domain.Entities;

public class ServiceOrderOperation
{
    public long Id { get; set; }
    public long ServiceOrderId { get; set; }
    public long ServiceOperationId { get; set; }
    public decimal WorkHours { get; set; }
    public decimal PricePerHour { get; set; }
    public decimal TotalPrice { get; set; }

    public ServiceOrder? ServiceOrder { get; set; }
    public ServiceOperation? ServiceOperation { get; set; }
}
