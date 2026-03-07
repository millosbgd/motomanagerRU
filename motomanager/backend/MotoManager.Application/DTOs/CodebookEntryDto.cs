namespace MotoManager.Application.DTOs;

public record CodebookEntryDto(
    long Id,
    string Entity,
    string Code,
    string Name,
    int SortOrder,
    bool IsActive
);

public record CreateCodebookEntryRequest(
    string Entity,
    string Code,
    string Name,
    int SortOrder = 0
);

public record UpdateCodebookEntryRequest(
    string Code,
    string Name,
    int SortOrder,
    bool IsActive
);
