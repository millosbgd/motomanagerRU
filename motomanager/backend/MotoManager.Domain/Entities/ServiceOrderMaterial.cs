namespace MotoManager.Domain.Entities;

public class ServiceOrderMaterial
{
    public long Id { get; set; }
    public long ServiceOrderId { get; set; }
    public long MaterialId { get; set; }
    public decimal Quantity { get; set; }
    public decimal PricePerUnit { get; set; }
    public decimal TotalPrice { get; set; }

    public ServiceOrder? ServiceOrder { get; set; }
    public Material? Material { get; set; }
}
