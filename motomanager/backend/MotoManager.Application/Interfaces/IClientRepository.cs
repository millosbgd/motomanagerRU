using MotoManager.Domain.Entities;

namespace MotoManager.Application.Interfaces;

public interface IClientRepository
{
    Task<IEnumerable<Client>> GetAllAsync(CancellationToken ct);
    Task<Client?> GetByIdAsync(long id, CancellationToken ct);
    Task<Client> CreateAsync(Client client, CancellationToken ct);
    Task<Client?> UpdateAsync(Client client, CancellationToken ct);
    Task<bool> DeleteAsync(long id, CancellationToken ct);
}
