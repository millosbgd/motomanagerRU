using MotoManager.Application.DTOs;

namespace MotoManager.Application.Interfaces;

public interface IClientService
{
    Task<IEnumerable<ClientDto>> GetAllAsync(CancellationToken ct);
    Task<ClientDto?> GetByIdAsync(long id, CancellationToken ct);
    Task<ClientDto> CreateAsync(CreateClientRequest request, CancellationToken ct);
    Task<ClientDto?> UpdateAsync(long id, UpdateClientRequest request, CancellationToken ct);
    Task<bool> DeleteAsync(long id, CancellationToken ct);
}
