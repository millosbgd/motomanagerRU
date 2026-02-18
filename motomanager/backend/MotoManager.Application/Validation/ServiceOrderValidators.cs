using FluentValidation;
using MotoManager.Application.DTOs;

namespace MotoManager.Application.Validation;

public class CreateServiceOrderRequestValidator : AbstractValidator<CreateServiceOrderRequest>
{
    public CreateServiceOrderRequestValidator()
    {
        RuleFor(x => x.VehicleId).GreaterThan(0);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(500);
    }
}

public class UpdateServiceOrderRequestValidator : AbstractValidator<UpdateServiceOrderRequest>
{
    public UpdateServiceOrderRequestValidator()
    {
        RuleFor(x => x.Description).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Status).IsInEnum();
    }
}
