using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RFI.API.Migrations.AdminDb
{
    /// <inheritdoc />
    public partial class InitialPostgresAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // this migration previously adjusted column types when transitioning from
            // SQLite to PostgreSQL.  All base migrations now create the correct types
            // so no structural changes are required here.  The migration is retained
            // only to preserve history and may contain seed updates if needed.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // no operations needed during rollback; structural changes already handled
            // by earlier migrations.  This method is kept empty intentionally.
        }
    }
}
