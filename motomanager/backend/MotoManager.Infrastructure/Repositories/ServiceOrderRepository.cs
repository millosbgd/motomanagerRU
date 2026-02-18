using Microsoft.EntityFrameworkCore;
using MotoManager.Application.Interfaces;
using MotoManager.Domain.Entities;
using MotoManager.Infrastructure.Data;

namespace MotoManager.Infrastructure.Repositories;

public class ServiceOrderRepository(MotoManagerDbContext dbContext) : IServiceOrderRepository
{
    public Task<List<ServiceOrder>> GetAllAsync(CancellationToken ct)
        => dbContext.ServiceOrders.AsNoTracking().ToListAsync(ct);

    public Task<ServiceOrder?> GetByIdAsync(long id, CancellationToken ct)
        => dbContext.ServiceOrders.FirstOrDefaultAsync(s => s.Id == id, ct);

    public async Task AddAsync(ServiceOrder order, CancellationToken ct)
    {
        dbContext.ServiceOrders.Add(order);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(ServiceOrder order, CancellationToken ct)
    {
        dbContext.ServiceOrders.Update(order);
        await dbContext.SaveChangesAsync(ct);
    }
}
