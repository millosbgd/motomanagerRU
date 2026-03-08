namespace MotoManager.Domain.Entities;

public class ServiceOrderActivity
{
    public long Id { get; set; }
    public long ServiceOrderId { get; set; }
    public long ServiceActivityId { get; set; }

    public ServiceOrder? ServiceOrder { get; set; }
    public ServiceActivity? ServiceActivity { get; set; }
}
