using MotoManager.Application.DTOs;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;

namespace MotoManager.Application.Services;

public class ClientService(IClientRepository repository) : IClientService
{
    public async Task<IEnumerable<ClientDto>> GetAllAsync(CancellationToken ct)
        => (await repository.GetAllAsync(ct)).Select(ToDto);

    public async Task<ClientDto?> GetByIdAsync(long id, CancellationToken ct)
        => (await repository.GetByIdAsync(id, ct)) is { } c ? ToDto(c) : null;

    public async Task<ClientDto> CreateAsync(CreateClientRequest request, CancellationToken ct)
    {
        var client = new Client
        {
            Name = request.Name.Trim(),
            Address = request.Address?.Trim(),
            City = request.City?.Trim(),
            Country = request.Country?.Trim(),
            IsActive = true
        };
        return ToDto(await repository.CreateAsync(client, ct));
    }

    public async Task<ClientDto?> UpdateAsync(long id, UpdateClientRequest request, CancellationToken ct)
    {
        var existing = await repository.GetByIdAsync(id, ct);
        if (existing is null) return null;

        existing.Name = request.Name.Trim();
        existing.Address = request.Address?.Trim();
        existing.City = request.City?.Trim();
        existing.Country = request.Country?.Trim();
        existing.IsActive = request.IsActive;

        return (await repository.UpdateAsync(existing, ct)) is { } updated ? ToDto(updated) : null;
    }

    public Task<bool> DeleteAsync(long id, CancellationToken ct)
        => repository.DeleteAsync(id, ct);

    private static ClientDto ToDto(Client c) =>
        new(c.Id, c.Name, c.Address, c.City, c.Country, c.IsActive);
}
