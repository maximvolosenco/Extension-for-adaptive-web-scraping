using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Adaptive.Data.Migrations
{
    public partial class Create_ScrapeOrder_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserID",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ScrapeOrder",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", maxLength: 250, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScrapeOrder", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ScrapeOrder_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserID",
                table: "Reviews",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_ScrapeOrder_UserID",
                table: "ScrapeOrder",
                column: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Users_UserID",
                table: "Reviews",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Users_UserID",
                table: "Reviews");

            migrationBuilder.DropTable(
                name: "ScrapeOrder");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_UserID",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "UserID",
                table: "Reviews");
        }
    }
}
