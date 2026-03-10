using Microsoft.EntityFrameworkCore;
using MotoManager.Domain.Entities;

namespace MotoManager.Infrastructure.Data;

public class MotoManagerDbContext(DbContextOptions<MotoManagerDbContext> options) : DbContext(options)
{
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<ServiceOrder> ServiceOrders => Set<ServiceOrder>();
    public DbSet<CodebookEntry> CodebookEntries => Set<CodebookEntry>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<ServiceActivity> ServiceActivities => Set<ServiceActivity>();
    public DbSet<ServiceOrderActivity> ServiceOrderActivities => Set<ServiceOrderActivity>();
    public DbSet<ServiceActivityDefaultOperation> ServiceActivityDefaultOperations => Set<ServiceActivityDefaultOperation>();
    public DbSet<ServiceActivityDefaultMaterial> ServiceActivityDefaultMaterials => Set<ServiceActivityDefaultMaterial>();
    public DbSet<UnitOfMeasure> UnitOfMeasures => Set<UnitOfMeasure>();
    public DbSet<Material> Materials => Set<Material>();
    public DbSet<ServiceOperation> ServiceOperations => Set<ServiceOperation>();
    public DbSet<ServiceOrderOperation> ServiceOrderOperations => Set<ServiceOrderOperation>();
    public DbSet<ServiceOrderMaterial> ServiceOrderMaterials => Set<ServiceOrderMaterial>();

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
            entity.Property(v => v.ClientId).HasColumnName("client_id");
            entity.HasOne(v => v.Client)
                .WithMany()
                .HasForeignKey(v => v.ClientId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);
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

        modelBuilder.Entity<Client>(entity =>
        {
            entity.ToTable("clients");
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).HasMaxLength(128).IsRequired();
            entity.Property(c => c.Address).HasMaxLength(256);
            entity.Property(c => c.City).HasMaxLength(128);
            entity.Property(c => c.Country).HasMaxLength(64);
        });

        modelBuilder.Entity<ServiceActivity>(entity =>
        {
            entity.ToTable("service_activities");
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Name).HasMaxLength(128).IsRequired();
        });

        modelBuilder.Entity<ServiceOrderActivity>(entity =>
        {
            entity.ToTable("service_order_activities");
            entity.HasKey(soa => soa.Id);
            entity.HasIndex(soa => new { soa.ServiceOrderId, soa.ServiceActivityId }).IsUnique();
            entity.HasOne(soa => soa.ServiceOrder)
                .WithMany()
                .HasForeignKey(soa => soa.ServiceOrderId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(soa => soa.ServiceActivity)
                .WithMany()
                .HasForeignKey(soa => soa.ServiceActivityId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ServiceActivityDefaultOperation>(entity =>
        {
            entity.ToTable("service_activity_default_operations");
            entity.HasKey(x => x.Id);
            entity.HasIndex(x => new { x.ServiceActivityId, x.ServiceOperationId }).IsUnique();
            entity.Property(x => x.WorkHours).HasColumnType("numeric(6,2)");
            entity.HasOne(x => x.ServiceActivity)
                .WithMany()
                .HasForeignKey(x => x.ServiceActivityId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.ServiceOperation)
                .WithMany()
                .HasForeignKey(x => x.ServiceOperationId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ServiceActivityDefaultMaterial>(entity =>
        {
            entity.ToTable("service_activity_default_materials");
            entity.HasKey(x => x.Id);
            entity.HasIndex(x => new { x.ServiceActivityId, x.MaterialId }).IsUnique();
            entity.Property(x => x.Quantity).HasColumnType("numeric(10,4)");
            entity.HasOne(x => x.ServiceActivity)
                .WithMany()
                .HasForeignKey(x => x.ServiceActivityId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Material)
                .WithMany()
                .HasForeignKey(x => x.MaterialId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<UnitOfMeasure>(entity =>
        {
            entity.ToTable("unit_of_measures");
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Name).IsUnique();
            entity.Property(u => u.Name).HasMaxLength(64).IsRequired();
        });

        modelBuilder.Entity<Material>(entity =>
        {
            entity.ToTable("materials");
            entity.HasKey(m => m.Id);
            entity.Property(m => m.Name).HasMaxLength(128).IsRequired();
            entity.Property(m => m.UnitOfMeasureId).HasColumnName("unit_of_measure_id");
            entity.HasOne(m => m.UnitOfMeasure)
                .WithMany()
                .HasForeignKey(m => m.UnitOfMeasureId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ServiceOperation>(entity =>
        {
            entity.ToTable("service_operations");
            entity.HasKey(o => o.Id);
            entity.Property(o => o.Name).HasMaxLength(128).IsRequired();
            entity.Property(o => o.WorkHours).HasColumnType("numeric(6,2)");
        });

        modelBuilder.Entity<ServiceOrderOperation>(entity =>
        {
            entity.ToTable("service_order_operations");
            entity.HasKey(soo => soo.Id);
            entity.Property(soo => soo.WorkHours).HasColumnType("numeric(6,2)");
            entity.Property(soo => soo.PricePerHour).HasColumnType("numeric(10,2)");
            entity.Property(soo => soo.TotalPrice).HasColumnType("numeric(10,2)");
            entity.HasOne(soo => soo.ServiceOrder)
                .WithMany()
                .HasForeignKey(soo => soo.ServiceOrderId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(soo => soo.ServiceOperation)
                .WithMany()
                .HasForeignKey(soo => soo.ServiceOperationId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ServiceOrderMaterial>(entity =>
        {
            entity.ToTable("service_order_materials");
            entity.HasKey(som => som.Id);
            entity.Property(som => som.Quantity).HasColumnType("numeric(10,4)");
            entity.Property(som => som.PricePerUnit).HasColumnType("numeric(10,2)");
            entity.Property(som => som.TotalPrice).HasColumnType("numeric(10,2)");
            entity.HasOne(som => som.ServiceOrder)
                .WithMany()
                .HasForeignKey(som => som.ServiceOrderId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(som => som.Material)
                .WithMany()
                .HasForeignKey(som => som.MaterialId)
                .OnDelete(DeleteBehavior.Restrict);
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

            if (entry.Entity is Client client)
            {
                if (entry.State == EntityState.Added)
                {
                    client.CreatedAt = now;
                    client.UpdatedAt = now;
                }
                else if (entry.State == EntityState.Modified)
                {
                    client.UpdatedAt = now;
                }
            }

            if (entry.Entity is ServiceActivity activity)
            {
                if (entry.State == EntityState.Added)
                {
                    activity.CreatedAt = now;
                    activity.UpdatedAt = now;
                }
                else if (entry.State == EntityState.Modified)
                {
                    activity.UpdatedAt = now;
                }
            }

            if (entry.Entity is UnitOfMeasure unit)
            {
                if (entry.State == EntityState.Added)
                {
                    unit.CreatedAt = now;
                    unit.UpdatedAt = now;
                }
                else if (entry.State == EntityState.Modified)
                {
                    unit.UpdatedAt = now;
                }
            }

            if (entry.Entity is Material material)
            {
                if (entry.State == EntityState.Added)
                {
                    material.CreatedAt = now;
                    material.UpdatedAt = now;
                }
                else if (entry.State == EntityState.Modified)
                {
                    material.UpdatedAt = now;
                }
            }
        }
    }
}
