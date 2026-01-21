using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RFI.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    EventDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Location = table.Column<string>(type: "TEXT", nullable: false),
                    ImageUrls = table.Column<string>(type: "TEXT", nullable: false),
                    DetailedContent = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "CreatedAt", "Description", "DetailedContent", "EventDate", "ImageUrls", "IsActive", "Location", "Title" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 20, 12, 49, 44, 396, DateTimeKind.Utc).AddTicks(5896), "Justice for 30,000 Iranians - Crimes against humanity must be stopped.", "Iranians in Melbourne are gathering in front of Parliament House today from 4:00 pm to 6:00 pm to support King Reza Pahlavi and stand shoulder to shoulder with people inside Iran. Protesters are amplifying the voices of families demanding justice for more than 30,000 people killed by the regime and are calling for urgent international action to hold Tehran accountable for its crimes.", new DateTime(2026, 1, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "[\"https://www.riseforiran.org/images/highlights/18Jan.png\"]", true, "Parliament House, Melbourne", "Parliament Steps Vigil Australia - Melbourne" },
                    { 2, new DateTime(2026, 1, 20, 12, 49, 44, 396, DateTimeKind.Utc).AddTicks(5899), "Stand with Iran", "Details coming soon.", new DateTime(2026, 1, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", true, "TBD", "The Last Fight" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Events");
        }
    }
}
