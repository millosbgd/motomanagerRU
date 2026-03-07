using Microsoft.EntityFrameworkCore;
using MotoManager.Domain.Entities;

namespace MotoManager.Infrastructure.Data;

public class MotoManagerDbContext(DbContextOptions<MotoManagerDbContext> options) : DbContext(options)
{
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<ServiceOrder> ServiceOrders => Set<ServiceOrder>();
    public DbSet<CodebookEntry> CodebookEntries => Set<CodebookEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("public");

        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.ToTable("vehicles");
            entity.HasKey(v => v.Id);
            entity.HasIndex(v => v.Registration).IsUnique();
            entity.Property(v => v.Registration).HasMaxLength(32).IsRequired();
            entity.Property(v => v.Make).HasMaxLength(64).IsRequired();
            entity.Property(v => v.Model).HasMaxLength(64).IsRequired();
        });

        modelBuilder.Entity<ServiceOrder>(entity =>
        {
            entity.ToTable("service_orders");
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Description).HasMaxLength(500).IsRequired();
            entity.HasOne(s => s.Vehicle)
                .WithMany(v => v.ServiceOrders)
                .HasForeignKey(s => s.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<CodebookEntry>(entity =>
        {
            entity.ToTable("codebook_entries");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.Entity, e.Code }).IsUnique();
            entity.Property(e => e.Entity).HasMaxLength(64).IsRequired();
            entity.Property(e => e.Code).HasMaxLength(64).IsRequired();
            entity.Property(e => e.Name).HasMaxLength(128).IsRequired();
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    private void UpdateTimestamps()
    {
        var now = DateTimeOffset.UtcNow;
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.Entity is Vehicle vehicle)
            {
                if (entry.State == EntityState.Added)
                {
                    vehicle.CreatedAt = now;
                    vehicle.UpdatedAt = now;
                }
                else if (entry.State == EntityState.Modified)
                {
                    vehicle.UpdatedAt = now;
                }
            }

            if (entry.Entity is ServiceOrder order)
            {
                if (entry.State == EntityState.Added)
                {
                    order.CreatedAt = now;
                    order.UpdatedAt = now;
                }
                else if (entry.State == EntityState.Modified)
                {
                    order.UpdatedAt = now;
                }
            }

            if (entry.Entity is CodebookEntry codebook)
            {
                if (entry.State == EntityState.Added)
                {
                    codebook.CreatedAt = now;
                    codebook.UpdatedAt = now;
                }
                else if (entry.State == EntityState.Modified)
                {
                    codebook.UpdatedAt = now;
                }
            }
        }
    }
}
