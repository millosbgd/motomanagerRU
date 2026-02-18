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

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<MotoManagerDbContext>();
    await dbContext.Database.MigrateAsync();
    await DbSeeder.SeedAsync(dbContext, CancellationToken.None);
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
