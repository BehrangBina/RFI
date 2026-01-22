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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.UpdateData(
                table: "Posters",
                keyColumn: "Id",
                keyValue: 1,
                column: "UploadedAt",
                value: new DateTime(2026, 1, 21, 12, 14, 5, 470, DateTimeKind.Utc).AddTicks(6718));

            migrationBuilder.UpdateData(
                table: "Posters",
                keyColumn: "Id",
                keyValue: 2,
                column: "UploadedAt",
                value: new DateTime(2026, 1, 21, 12, 14, 5, 470, DateTimeKind.Utc).AddTicks(6721));

            migrationBuilder.UpdateData(
                table: "Posters",
                keyColumn: "Id",
                keyValue: 3,
                column: "UploadedAt",
                value: new DateTime(2026, 1, 21, 12, 14, 5, 470, DateTimeKind.Utc).AddTicks(6723));
        }
    }
}
