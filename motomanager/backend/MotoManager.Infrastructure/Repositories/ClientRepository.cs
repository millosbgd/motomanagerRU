using Microsoft.EntityFrameworkCore;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;
using MotoManager.Infrastructure.Data;

namespace MotoManager.Infrastructure.Repositories;

public class ClientRepository(MotoManagerDbContext db) : IClientRepository
{
    public async Task<IEnumerable<Client>> GetAllAsync(CancellationToken ct)
        => await db.Clients
            .FromSqlRaw("SELECT * FROM fn_get_all_clients()")
            .AsNoTracking()
            .ToListAsync(ct);

    public Task<Client?> GetByIdAsync(long id, CancellationToken ct)
        => db.Clients
            .FromSqlInterpolated($"SELECT * FROM fn_get_client_by_id({id})")
            .FirstOrDefaultAsync(ct);

    public async Task<Client> CreateAsync(Client client, CancellationToken ct)
    {
        db.Clients.Add(client);
        await db.SaveChangesAsync(ct);
        return client;
    }

    public async Task<Client?> UpdateAsync(Client client, CancellationToken ct)
    {
        db.Clients.Update(client);
        await db.SaveChangesAsync(ct);
        return client;
    }

    public async Task<bool> DeleteAsync(long id, CancellationToken ct)
    {
        var client = await GetByIdAsync(id, ct);
        if (client is null) return false;
        db.Clients.Remove(client);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
