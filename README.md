# RFI

## Data storage quick reference

- **Database provider** – Controlled via `Database:Provider` in `RFI.API/appsettings*.json`. Supported values today: `Sqlite`, `SqlServer`, `Postgres`, `MySql`. Set `Database:ConnectionStringName` to the matching entry under `ConnectionStrings` and provide the real connection string when switching. The API automatically wires EF Core to the appropriate provider package.
- **Poster assets** – Uploaded files are saved under `RFI.API/wwwroot/posters`. The API serves these via static files, so the React frontend can use the `FileUrl`/`ThumbnailUrl` returned by `/api/posters`. To change the storage root, adjust `PosterStorage:BaseFolder`.
- **Poster uploads** – Send a `multipart/form-data` request to `POST /api/posters` containing `eventId`, `title`, `file`, and optional `thumbnail`. The endpoint validates the event, writes files to disk through `IPosterAssetService`, and persists metadata to the current database.