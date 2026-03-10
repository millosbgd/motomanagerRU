namespace MotoManager.Domain.Entities;

public class ServiceActivityDefaultOperation
{
    public long Id { get; set; }
    public long ServiceActivityId { get; set; }
    public long ServiceOperationId { get; set; }
    public decimal WorkHours { get; set; }

    public ServiceActivity? ServiceActivity { get; set; }
    public ServiceOperation? ServiceOperation { get; set; }
}
