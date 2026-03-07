namespace MotoManager.Domain.Entities;

public class CodebookEntry
{
    public long Id { get; set; }

    /// <summary>Grupišući naziv šifarnika, npr. "ServiceOrderStatus", "VehicleType", "Country"</summary>
    public string Entity { get; set; } = string.Empty;

    /// <summary>Jedinstveni kod unutar entiteta, npr. "Open", "Motorcycle", "RS"</summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>Naziv za prikaz, npr. "Otvoreno", "Motocikl", "Srbija"</summary>
    public string Name { get; set; } = string.Empty;

    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
