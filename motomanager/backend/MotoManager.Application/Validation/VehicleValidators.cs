using FluentValidation;
using MotoManager.Application.DTOs;

namespace MotoManager.Application.Validation;

public class CreateVehicleRequestValidator : AbstractValidator<CreateVehicleRequest>
{
    public CreateVehicleRequestValidator()
    {
        RuleFor(x => x.Registration).NotEmpty().MaximumLength(32);
        RuleFor(x => x.Make).NotEmpty().MaximumLength(64);
        RuleFor(x => x.Model).NotEmpty().MaximumLength(64);
        RuleFor(x => x.Year).InclusiveBetween(1950, DateTimeOffset.UtcNow.Year + 1).When(x => x.Year.HasValue);
    }
}

public class UpdateVehicleRequestValidator : AbstractValidator<UpdateVehicleRequest>
{
    public UpdateVehicleRequestValidator()
    {
        RuleFor(x => x.Registration).NotEmpty().MaximumLength(32);
        RuleFor(x => x.Make).NotEmpty().MaximumLength(64);
        RuleFor(x => x.Model).NotEmpty().MaximumLength(64);
        RuleFor(x => x.Year).InclusiveBetween(1950, DateTimeOffset.UtcNow.Year + 1).When(x => x.Year.HasValue);
    }
}
