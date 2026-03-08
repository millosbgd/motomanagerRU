namespace MotoManager.Domain.Entities;

public class Material
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public long UnitOfMeasureId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public UnitOfMeasure? UnitOfMeasure { get; set; }
}
