namespace MotoManager.Domain.Entities;

public class ServiceOperation
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal WorkHours { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
