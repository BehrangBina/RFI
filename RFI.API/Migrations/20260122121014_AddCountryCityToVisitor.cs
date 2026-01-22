using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RFI.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCountryCityToVisitor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Visitors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IpAddress = table.Column<string>(type: "TEXT", nullable: false),
                    Country = table.Column<string>(type: "TEXT", nullable: true),
                    City = table.Column<string>(type: "TEXT", nullable: true),
                    VisitedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    PageUrl = table.Column<string>(type: "TEXT", nullable: true),
                    UserAgent = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Visitors", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 22, 12, 10, 14, 109, DateTimeKind.Utc).AddTicks(6336));

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 22, 12, 10, 14, 109, DateTimeKind.Utc).AddTicks(6340));

            migrationBuilder.UpdateData(
                table: "Posters",
                keyColumn: "Id",
                keyValue: 1,
                column: "UploadedAt",
                value: new DateTime(2026, 1, 22, 12, 10, 14, 109, DateTimeKind.Utc).AddTicks(6518));

            migrationBuilder.UpdateData(
                table: "Posters",
                keyColumn: "Id",
                keyValue: 2,
                column: "UploadedAt",
                value: new DateTime(2026, 1, 22, 12, 10, 14, 109, DateTimeKind.Utc).AddTicks(6522));

            migrationBuilder.UpdateData(
                table: "Posters",
                keyColumn: "Id",
                keyValue: 3,
                column: "UploadedAt",
                value: new DateTime(2026, 1, 22, 12, 10, 14, 109, DateTimeKind.Utc).AddTicks(6525));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Visitors");

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 22, 11, 58, 9, 360, DateTimeKind.Utc).AddTicks(5638));

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 22, 11, 58, 9, 360, DateTimeKind.Utc).AddTicks(5641));

            migrationBuilder.UpdateData(
                table: "Posters",
                keyColumn: "Id",
                keyValue: 1,
                column: "UploadedAt",
                value: new DateTime(2026, 1, 22, 11, 58, 9, 360, DateTimeKind.Utc).AddTicks(5738));

            migrationBuilder.UpdateData(
                table: "Posters",
                keyColumn: "Id",
                keyValue: 2,
                column: "UploadedAt",
                value: new DateTime(2026, 1, 22, 11, 58, 9, 360, DateTimeKind.Utc).AddTicks(5741));

            migrationBuilder.UpdateData(
                table: "Posters",
                keyColumn: "Id",
                keyValue: 3,
                column: "UploadedAt",
                value: new DateTime(2026, 1, 22, 11, 58, 9, 360, DateTimeKind.Utc).AddTicks(5742));
        }
    }
}
