using MotoManager.Application.DTOs;

namespace MotoManager.Application.Interfaces;

public interface IMaterialService
{
    Task<List<MaterialDto>> GetAllAsync(CancellationToken ct);
    Task<MaterialDto?> GetByIdAsync(long id, CancellationToken ct);
    Task<MaterialDto> CreateAsync(CreateMaterialRequest request, CancellationToken ct);
    Task<MaterialDto?> UpdateAsync(long id, UpdateMaterialRequest request, CancellationToken ct);
    Task<bool> DeleteAsync(long id, CancellationToken ct);
}
