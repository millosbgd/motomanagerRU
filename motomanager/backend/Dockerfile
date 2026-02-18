FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY MotoManager.Domain/MotoManager.Domain.csproj MotoManager.Domain/
COPY MotoManager.Application/MotoManager.Application.csproj MotoManager.Application/
COPY MotoManager.Infrastructure/MotoManager.Infrastructure.csproj MotoManager.Infrastructure/
COPY MotoManager.Api/MotoManager.Api.csproj MotoManager.Api/

RUN dotnet restore "MotoManager.Api/MotoManager.Api.csproj"

COPY MotoManager.Domain/ MotoManager.Domain/
COPY MotoManager.Application/ MotoManager.Application/
COPY MotoManager.Infrastructure/ MotoManager.Infrastructure/
COPY MotoManager.Api/ MotoManager.Api/

RUN dotnet publish "MotoManager.Api/MotoManager.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "MotoManager.Api.dll"]
