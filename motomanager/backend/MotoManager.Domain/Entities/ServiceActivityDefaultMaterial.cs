namespace MotoManager.Domain.Entities;

public class ServiceActivityDefaultMaterial
{
    public long Id { get; set; }
    public long ServiceActivityId { get; set; }
    public long MaterialId { get; set; }
    public decimal Quantity { get; set; }

    public ServiceActivity? ServiceActivity { get; set; }
    public Material? Material { get; set; }
}
