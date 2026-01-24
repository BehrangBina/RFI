using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RFI.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDonations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Donations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DonorName = table.Column<string>(type: "TEXT", nullable: false),
                    Amount = table.Column<decimal>(type: "TEXT", nullable: false),
                    Currency = table.Column<string>(type: "TEXT", nullable: false),
                    PayPalTransactionId = table.Column<string>(type: "TEXT", nullable: false),
                    PayPalPayerId = table.Column<string>(type: "TEXT", nullable: false),
                    DonatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Message = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Donations", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 22, 13, 2, 13, 881, DateTimeKind.Utc).AddTicks(2747));

            migrationBuilder.UpdateData(
                table: "Events",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 22, 13, 2, 13, 881, DateTimeKind.Utc).AddTicks(2750));

            migrationBuilder.UpdateData(
                table: "Posters",
                keyColumn: "Id",
                keyValue: 1,
                column: "UploadedAt",
                value: new DateTime(2026, 1, 22, 13, 2, 13, 881, DateTimeKind.Utc).AddTicks(2840));

            migrationBuilder.UpdateData(
                table: "Posters",
                keyColumn: "Id",
                keyValue: 2,
                column: "UploadedAt",
                value: new DateTime(2026, 1, 22, 13, 2, 13, 881, DateTimeKind.Utc).AddTicks(2842));

            migrationBuilder.UpdateData(
                table: "Posters",
                keyColumn: "Id",
                keyValue: 3,
                column: "UploadedAt",
                value: new DateTime(2026, 1, 22, 13, 2, 13, 881, DateTimeKind.Utc).AddTicks(2844));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Donations");

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
    }
}
