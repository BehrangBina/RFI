using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RFI.API.Migrations.ApplicationDb
{
    /// <inheritdoc />
    public partial class AddEcommerceSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketInstance_TicketPurchases_PurchaseId",
                table: "TicketInstance");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TicketInstance",
                table: "TicketInstance");

            migrationBuilder.RenameTable(
                name: "TicketInstance",
                newName: "TicketInstances");

            migrationBuilder.RenameColumn(
                name: "PurchaseId",
                table: "TicketInstances",
                newName: "OrderItemId");

            migrationBuilder.RenameIndex(
                name: "IX_TicketInstance_PurchaseId",
                table: "TicketInstances",
                newName: "IX_TicketInstances_OrderItemId");

            migrationBuilder.AddColumn<int>(
                name: "AvailableTickets",
                table: "Events",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsTicketSaleActive",
                table: "Events",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "TicketPrice",
                table: "Events",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TotalTickets",
                table: "Events",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TicketPurchaseId",
                table: "TicketInstances",
                type: "integer",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TicketInstances",
                table: "TicketInstances",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Category = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    StockQuantity = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    RequiresShipping = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: true),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OrderNumber = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: true),
                    CustomerName = table.Column<string>(type: "text", nullable: false),
                    CustomerEmail = table.Column<string>(type: "text", nullable: false),
                    CustomerPhone = table.Column<string>(type: "text", nullable: true),
                    SubtotalPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    ShippingCost = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    PaymentStatus = table.Column<string>(type: "text", nullable: false),
                    PaymentMethod = table.Column<string>(type: "text", nullable: true),
                    OrderDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ShippingAddress = table.Column<string>(type: "text", nullable: true),
                    ShippingCity = table.Column<string>(type: "text", nullable: true),
                    ShippingPostalCode = table.Column<string>(type: "text", nullable: true),
                    ShippingCountry = table.Column<string>(type: "text", nullable: true),
                    TrackingNumber = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OrderId = table.Column<int>(type: "integer", nullable: false),
                    ItemType = table.Column<string>(type: "text", nullable: false),
                    ProductId = table.Column<int>(type: "integer", nullable: true),
                    EventId = table.Column<int>(type: "integer", nullable: true),
                    ItemName = table.Column<string>(type: "text", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TicketInstances_TicketCode",
                table: "TicketInstances",
                column: "TicketCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TicketInstances_TicketPurchaseId",
                table: "TicketInstances",
                column: "TicketPurchaseId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_EventId",
                table: "OrderItems",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrderNumber",
                table: "Orders",
                column: "OrderNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Slug",
                table: "Products",
                column: "Slug",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketInstances_OrderItems_OrderItemId",
                table: "TicketInstances",
                column: "OrderItemId",
                principalTable: "OrderItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketInstances_TicketPurchases_TicketPurchaseId",
                table: "TicketInstances",
                column: "TicketPurchaseId",
                principalTable: "TicketPurchases",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketInstances_OrderItems_OrderItemId",
                table: "TicketInstances");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketInstances_TicketPurchases_TicketPurchaseId",
                table: "TicketInstances");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TicketInstances",
                table: "TicketInstances");

            migrationBuilder.DropIndex(
                name: "IX_TicketInstances_TicketCode",
                table: "TicketInstances");

            migrationBuilder.DropIndex(
                name: "IX_TicketInstances_TicketPurchaseId",
                table: "TicketInstances");

            migrationBuilder.DropColumn(
                name: "AvailableTickets",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "IsTicketSaleActive",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "TicketPrice",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "TotalTickets",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "TicketPurchaseId",
                table: "TicketInstances");

            migrationBuilder.RenameTable(
                name: "TicketInstances",
                newName: "TicketInstance");

            migrationBuilder.RenameColumn(
                name: "OrderItemId",
                table: "TicketInstance",
                newName: "PurchaseId");

            migrationBuilder.RenameIndex(
                name: "IX_TicketInstances_OrderItemId",
                table: "TicketInstance",
                newName: "IX_TicketInstance_PurchaseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TicketInstance",
                table: "TicketInstance",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TicketInstance_TicketPurchases_PurchaseId",
                table: "TicketInstance",
                column: "PurchaseId",
                principalTable: "TicketPurchases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
