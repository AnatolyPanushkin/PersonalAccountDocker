using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace PersonalAccount.Data
{
    public partial class AirCompaniesContext : DbContext
    {
        public AirCompaniesContext()
        {
        }

        public AirCompaniesContext(DbContextOptions<AirCompaniesContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AirlineCompany> AirlineCompany { get; set; } = null!;
        public virtual DbSet<DataAll> DataAlls { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSnakeCaseNamingConvention();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DataAll>(entity =>
            {
                entity.HasNoKey();
            });
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
