using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using MotoManager.Api;
using MotoManager.Application.DTOs;
using MotoManager.Application.Interfaces;
using MotoManager.Application.Services;
using MotoManager.Application.Validation;
using MotoManager.Infrastructure.Data;
using MotoManager.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddProblemDetails();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors();
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
    options.SerializerOptions.PropertyNameCaseInsensitive = true;
});

builder.Services.AddDbContext<MotoManagerDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("Default");
    options.UseNpgsql(connectionString, o => o.MigrationsAssembly("MotoManager.Infrastructure"));
    options.UseSnakeCaseNamingConvention();
});

builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IServiceOrderRepository, ServiceOrderRepository>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IServiceOrderService, ServiceOrderService>();
builder.Services.AddScoped<ICodebookRepository, CodebookRepository>();
builder.Services.AddScoped<ICodebookService, CodebookService>();
builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<IServiceActivityRepository, ServiceActivityRepository>();
builder.Services.AddScoped<IServiceActivityService, ServiceActivityService>();
builder.Services.AddScoped<IUnitOfMeasureRepository, UnitOfMeasureRepository>();
builder.Services.AddScoped<IUnitOfMeasureService, UnitOfMeasureService>();
builder.Services.AddScoped<IMaterialRepository, MaterialRepository>();
builder.Services.AddScoped<IMaterialService, MaterialService>();

builder.Services.AddValidatorsFromAssemblyContaining<CreateVehicleRequestValidator>();

var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];
app.UseCors(policy =>
{
    if (allowedOrigins.Length == 0)
    {
        policy.AllowAnyOrigin();
    }
    else
    {
        policy.WithOrigins(allowedOrigins);
    }

    policy.AllowAnyHeader().AllowAnyMethod();
});

app.MapGet("/", () => Results.Ok("MotoManager API"));

var vehicleGroup = app.MapGroup("/api/vehicles");

vehicleGroup.MapGet("/", async (IVehicleService service, CancellationToken ct)
    => Results.Ok(await service.GetAllAsync(ct)));

vehicleGroup.MapGet("/{id:long}", async (long id, IVehicleService service, CancellationToken ct)
    => await service.GetByIdAsync(id, ct) is { } vehicle
        ? Results.Ok(vehicle)
        : Results.NotFound());

vehicleGroup.MapPost("/", async (
    CreateVehicleRequest request,
    IVehicleService service,
    IValidator<CreateVehicleRequest> validator,
    CancellationToken ct) =>
{
    var validationResult = await validator.ValidateAsync(request, ct);
    if (!validationResult.IsValid)
    {
        return validationResult.ToValidationProblem();
    }

    var created = await service.CreateAsync(request, ct);
    return Results.Created($"/api/vehicles/{created.Id}", created);
});

vehicleGroup.MapPut("/{id:long}", async (
    long id,
    UpdateVehicleRequest request,
    IVehicleService service,
    IValidator<UpdateVehicleRequest> validator,
    CancellationToken ct) =>
{
    var validationResult = await validator.ValidateAsync(request, ct);
    if (!validationResult.IsValid)
    {
        return validationResult.ToValidationProblem();
    }

    var updated = await service.UpdateAsync(id, request, ct);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

vehicleGroup.MapDelete("/{id:long}", async (long id, IVehicleService service, CancellationToken ct)
    => await service.SoftDeleteAsync(id, ct) ? Results.NoContent() : Results.NotFound());

var orderGroup = app.MapGroup("/api/service-orders");

orderGroup.MapGet("/", async (IServiceOrderService service, CancellationToken ct)
    => Results.Ok(await service.GetAllAsync(ct)));

orderGroup.MapGet("/{id:long}", async (long id, IServiceOrderService service, CancellationToken ct)
    => await service.GetByIdAsync(id, ct) is { } order
        ? Results.Ok(order)
        : Results.NotFound());

orderGroup.MapPost("/", async (
    CreateServiceOrderRequest request,
    IServiceOrderService service,
    IValidator<CreateServiceOrderRequest> validator,
    CancellationToken ct) =>
{
    var validationResult = await validator.ValidateAsync(request, ct);
    if (!validationResult.IsValid)
    {
        return validationResult.ToValidationProblem();
    }

    var created = await service.CreateAsync(request, ct);
    return Results.Created($"/api/service-orders/{created.Id}", created);
});

orderGroup.MapPut("/{id:long}", async (
    long id,
    UpdateServiceOrderRequest request,
    IServiceOrderService service,
    IValidator<UpdateServiceOrderRequest> validator,
    CancellationToken ct) =>
{
    var validationResult = await validator.ValidateAsync(request, ct);
    if (!validationResult.IsValid)
    {
        return validationResult.ToValidationProblem();
    }

    var updated = await service.UpdateAsync(id, request, ct);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

orderGroup.MapPost("/{id:long}/close", async (long id, IServiceOrderService service, CancellationToken ct)
    => await service.CloseAsync(id, ct) is { } closed
        ? Results.Ok(closed)
        : Results.NotFound());

orderGroup.MapGet("/{id:long}/activities", async (long id, IServiceActivityService activityService, CancellationToken ct)
    => Results.Ok(await activityService.GetByServiceOrderAsync(id, ct)));

orderGroup.MapPost("/{id:long}/activities/{activityId:long}", async (long id, long activityId, IServiceActivityService activityService, CancellationToken ct)
    => await activityService.AddToOrderAsync(id, activityId, ct) ? Results.NoContent() : Results.Conflict());

orderGroup.MapDelete("/{id:long}/activities/{activityId:long}", async (long id, long activityId, IServiceActivityService activityService, CancellationToken ct)
    => await activityService.RemoveFromOrderAsync(id, activityId, ct) ? Results.NoContent() : Results.NotFound());

var activityGroup = app.MapGroup("/api/service-activities");

activityGroup.MapGet("/", async (IServiceActivityService service, CancellationToken ct)
    => Results.Ok(await service.GetAllAsync(ct)));

activityGroup.MapGet("/{id:long}", async (long id, IServiceActivityService service, CancellationToken ct)
    => await service.GetByIdAsync(id, ct) is { } a ? Results.Ok(a) : Results.NotFound());

activityGroup.MapPost("/", async (CreateServiceActivityRequest request, IServiceActivityService service, CancellationToken ct) =>
{
    var created = await service.CreateAsync(request, ct);
    return Results.Created($"/api/service-activities/{created.Id}", created);
});

activityGroup.MapPut("/{id:long}", async (long id, UpdateServiceActivityRequest request, IServiceActivityService service, CancellationToken ct) =>
{
    var updated = await service.UpdateAsync(id, request, ct);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

activityGroup.MapDelete("/{id:long}", async (long id, IServiceActivityService service, CancellationToken ct)
    => await service.DeleteAsync(id, ct) ? Results.NoContent() : Results.NotFound());

var unitOfMeasureGroup = app.MapGroup("/api/unit-of-measures");

unitOfMeasureGroup.MapGet("/", async (IUnitOfMeasureService service, CancellationToken ct)
    => Results.Ok(await service.GetAllAsync(ct)));

unitOfMeasureGroup.MapGet("/{id:long}", async (long id, IUnitOfMeasureService service, CancellationToken ct)
    => await service.GetByIdAsync(id, ct) is { } u ? Results.Ok(u) : Results.NotFound());

unitOfMeasureGroup.MapPost("/", async (CreateUnitOfMeasureRequest request, IUnitOfMeasureService service, CancellationToken ct) =>
{
    var created = await service.CreateAsync(request, ct);
    return Results.Created($"/api/unit-of-measures/{created.Id}", created);
});

unitOfMeasureGroup.MapPut("/{id:long}", async (long id, UpdateUnitOfMeasureRequest request, IUnitOfMeasureService service, CancellationToken ct) =>
{
    var updated = await service.UpdateAsync(id, request, ct);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

unitOfMeasureGroup.MapDelete("/{id:long}", async (long id, IUnitOfMeasureService service, CancellationToken ct)
    => await service.DeleteAsync(id, ct) ? Results.NoContent() : Results.NotFound());

var materialGroup = app.MapGroup("/api/materials");

materialGroup.MapGet("/", async (IMaterialService service, CancellationToken ct)
    => Results.Ok(await service.GetAllAsync(ct)));

materialGroup.MapGet("/{id:long}", async (long id, IMaterialService service, CancellationToken ct)
    => await service.GetByIdAsync(id, ct) is { } m ? Results.Ok(m) : Results.NotFound());

materialGroup.MapPost("/", async (CreateMaterialRequest request, IMaterialService service, CancellationToken ct) =>
{
    var created = await service.CreateAsync(request, ct);
    return Results.Created($"/api/materials/{created.Id}", created);
});

materialGroup.MapPut("/{id:long}", async (long id, UpdateMaterialRequest request, IMaterialService service, CancellationToken ct) =>
{
    var updated = await service.UpdateAsync(id, request, ct);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

materialGroup.MapDelete("/{id:long}", async (long id, IMaterialService service, CancellationToken ct)
    => await service.DeleteAsync(id, ct) ? Results.NoContent() : Results.NotFound());

var codebookGroup = app.MapGroup("/api/codebook");

codebookGroup.MapGet("/", async (ICodebookService service, CancellationToken ct)
    => Results.Ok(await service.GetAllAsync(ct)));

codebookGroup.MapGet("/{entity}", async (string entity, ICodebookService service, CancellationToken ct)
    => Results.Ok(await service.GetByEntityAsync(entity, ct)));

codebookGroup.MapPost("/", async (
    CreateCodebookEntryRequest request,
    ICodebookService service,
    CancellationToken ct) =>
{
    var created = await service.CreateAsync(request, ct);
    return Results.Created($"/api/codebook/{created.Id}", created);
});

codebookGroup.MapPut("/{id:long}", async (
    long id,
    UpdateCodebookEntryRequest request,
    ICodebookService service,
    CancellationToken ct) =>
{
    var updated = await service.UpdateAsync(id, request, ct);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

codebookGroup.MapDelete("/{id:long}", async (long id, ICodebookService service, CancellationToken ct)
    => await service.DeleteAsync(id, ct) ? Results.NoContent() : Results.NotFound());

var clientGroup = app.MapGroup("/api/clients");

clientGroup.MapGet("/", async (IClientService service, CancellationToken ct)
    => Results.Ok(await service.GetAllAsync(ct)));

clientGroup.MapGet("/{id:long}", async (long id, IClientService service, CancellationToken ct)
    => await service.GetByIdAsync(id, ct) is { } c
        ? Results.Ok(c)
        : Results.NotFound());

clientGroup.MapPost("/", async (
    CreateClientRequest request,
    IClientService service,
    CancellationToken ct) =>
{
    var created = await service.CreateAsync(request, ct);
    return Results.Created($"/api/clients/{created.Id}", created);
});

clientGroup.MapPut("/{id:long}", async (
    long id,
    UpdateClientRequest request,
    IClientService service,
    CancellationToken ct) =>
{
    var updated = await service.UpdateAsync(id, request, ct);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

clientGroup.MapDelete("/{id:long}", async (long id, IClientService service, CancellationToken ct)
    => await service.DeleteAsync(id, ct) ? Results.NoContent() : Results.NotFound());

// Kreiraj tabele ako ne postoje, seed samo u Development
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MotoManagerDbContext>();

    await dbContext.Database.ExecuteSqlRawAsync(@"
        CREATE TABLE IF NOT EXISTS public.vehicles (
            id bigserial PRIMARY KEY,
            registration varchar(32) NOT NULL,
            make varchar(64) NOT NULL,
            model varchar(64) NOT NULL,
            year integer NULL,
            is_active boolean NOT NULL DEFAULT true,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS public.service_orders (
            id bigserial PRIMARY KEY,
            vehicle_id bigint NOT NULL REFERENCES public.vehicles(id),
            description text NOT NULL,
            status integer NOT NULL DEFAULT 0,
            opened_at timestamptz NOT NULL DEFAULT now(),
            closed_at timestamptz NULL,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS public.codebook_entries (
            id bigserial PRIMARY KEY,
            entity varchar(64) NOT NULL,
            code varchar(64) NOT NULL,
            name varchar(128) NOT NULL,
            sort_order integer NOT NULL DEFAULT 0,
            is_active boolean NOT NULL DEFAULT true,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (entity, code)
        );

        CREATE TABLE IF NOT EXISTS public.clients (
            id bigserial PRIMARY KEY,
            name varchar(128) NOT NULL,
            address varchar(256) NULL,
            city varchar(128) NULL,
            country varchar(64) NULL,
            is_active boolean NOT NULL DEFAULT true,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS public.service_activities (
            id bigserial PRIMARY KEY,
            name varchar(128) NOT NULL,
            is_active boolean NOT NULL DEFAULT true,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS public.unit_of_measures (
            id bigserial PRIMARY KEY,
            name varchar(64) NOT NULL,
            is_active boolean NOT NULL DEFAULT true,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (name)
        );

        CREATE TABLE IF NOT EXISTS public.materials (
            id bigserial PRIMARY KEY,
            name varchar(128) NOT NULL,
            unit_of_measure_id bigint NOT NULL REFERENCES public.unit_of_measures(id) ON DELETE RESTRICT,
            is_active boolean NOT NULL DEFAULT true,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS public.service_order_activities (
            id bigserial PRIMARY KEY,
            service_order_id bigint NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
            service_activity_id bigint NOT NULL REFERENCES public.service_activities(id) ON DELETE RESTRICT,
            UNIQUE(service_order_id, service_activity_id)
        );
    ");

    if (app.Environment.IsDevelopment())
    {
        await DbSeeder.SeedAsync(dbContext, CancellationToken.None);
    }
}

app.Run();

internal static class ValidationResultExtensions
{
    public static IResult ToValidationProblem(this FluentValidation.Results.ValidationResult result)
    {
        var errors = result.Errors
            .GroupBy(e => e.PropertyName)
            .ToDictionary(
                g => g.Key,
                g => g.Select(e => e.ErrorMessage).ToArray());

        return Results.ValidationProblem(errors);
    }
}
