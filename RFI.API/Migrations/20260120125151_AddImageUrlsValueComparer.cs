using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RFI.API.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlsValueComparer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 12, 49, 44, 396, DateTimeKind.Utc).AddTicks(5896));

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 12, 49, 44, 396, DateTimeKind.Utc).AddTicks(5899));
        }
    }
}
