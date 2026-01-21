using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RFI.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPosters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Posters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EventId = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    FileUrl = table.Column<string>(type: "TEXT", nullable: false),
                    ThumbnailUrl = table.Column<string>(type: "TEXT", nullable: false),
                    FileSize = table.Column<long>(type: "INTEGER", nullable: false),
                    DownloadCount = table.Column<int>(type: "INTEGER", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Posters_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 21, 12, 14, 5, 470, DateTimeKind.Utc).AddTicks(6422));

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 21, 12, 14, 5, 470, DateTimeKind.Utc).AddTicks(6426));

            migrationBuilder.InsertData(
                table: "Posters",
                columns: new[] { "Id", "DownloadCount", "EventId", "FileSize", "FileUrl", "ThumbnailUrl", "Title", "UploadedAt" },
                values: new object[,]
                {
                    { 1, 0, 1, 2048000L, "/posters/charity-run-en.pdf", "/posters/thumbs/charity-run-en.jpg", "Charity Run Poster - English", new DateTime(2026, 1, 21, 12, 14, 5, 470, DateTimeKind.Utc).AddTicks(6718) },
                    { 2, 0, 1, 2100000L, "/posters/charity-run-es.pdf", "/posters/thumbs/charity-run-es.jpg", "Charity Run Poster - Spanish", new DateTime(2026, 1, 21, 12, 14, 5, 470, DateTimeKind.Utc).AddTicks(6721) },
                    { 3, 0, 2, 1800000L, "/posters/food-drive.pdf", "/posters/thumbs/food-drive.jpg", "Food Drive Flyer", new DateTime(2026, 1, 21, 12, 14, 5, 470, DateTimeKind.Utc).AddTicks(6723) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Posters_EventId",
                table: "Posters",
                column: "EventId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Posters");

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 12, 51, 51, 104, DateTimeKind.Utc).AddTicks(1430));

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 12, 51, 51, 104, DateTimeKind.Utc).AddTicks(1433));
        }
    }
}
