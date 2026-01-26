using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.IO;

namespace RFI.API.Services;

public class LocalPosterAssetService : IPosterAssetService
{
    private readonly IWebHostEnvironment _environment;
    private readonly PosterStorageOptions _options;

    public LocalPosterAssetService(IWebHostEnvironment environment, IOptions<PosterStorageOptions> options)
    {
        _environment = environment;
        _options = options.Value;
    }

    public async Task<StoredPosterAsset> SaveAsync(IFormFile file, string? subDirectory, CancellationToken cancellationToken = default)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("Poster file cannot be empty.", nameof(file));
        }

        var webRoot = EnsureWebRoot();
        var relativeFolder = CombineRelativeFolder(subDirectory);
        var targetDirectory = Path.Combine(webRoot, relativeFolder);
        Directory.CreateDirectory(targetDirectory);

        var extension = Path.GetExtension(file.FileName);
        var uniqueName = $"{Guid.NewGuid():N}{extension}".ToLowerInvariant();
        var absolutePath = Path.Combine(targetDirectory, uniqueName);

        await using (var stream = File.Create(absolutePath))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var relativePath = Path.Combine(relativeFolder, uniqueName).Replace('\\', '/');
        if (!relativePath.StartsWith('/'))
        {
            relativePath = "/" + relativePath;
        }

        return new StoredPosterAsset(relativePath, file.Length);
    }

    private string EnsureWebRoot()
    {
        var root = _environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(root))
        {
            root = Path.Combine(AppContext.BaseDirectory, "wwwroot");
        }

        Directory.CreateDirectory(root);
        return root;
    }

    private string CombineRelativeFolder(string? subDirectory)
    {
        var folder = _options.BaseFolder?.Trim('/') ?? "posters";
        if (!string.IsNullOrWhiteSpace(subDirectory))
        {
            var sanitized = subDirectory.Replace("..", string.Empty)
                                        .TrimStart(' ', Path.DirectorySeparatorChar, '/', '\\');
            folder = Path.Combine(folder, sanitized);
        }

        return folder.Replace('\\', Path.DirectorySeparatorChar);
    }
}
