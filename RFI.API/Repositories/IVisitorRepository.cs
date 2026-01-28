using RFI.API.Models;

namespace RFI.API.Repositories;

public interface IVisitorRepository : IRepository<Visitor>
{
    Task<Dictionary<string, int>> GetVisitorsByCountryAsync(CancellationToken cancellationToken = default);
    Task<List<(string City, string Country, int Visits)>> GetVisitorsByCityAsync(int topCount, CancellationToken cancellationToken = default);
}
