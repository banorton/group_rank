using Microsoft.EntityFrameworkCore;
using group_rank.API.Models;

namespace group_rank.API.Data
{
    public class PollContext : DbContext
    {
        public PollContext(DbContextOptions<PollContext> options) : base(options) { }

        public DbSet<Poll> Polls { get; set; }
        public DbSet<Option> Options { get; set; }
        public DbSet<Ranking> Rankings { get; set; } // Add this line to include Rankings

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure default values for GUIDs
            modelBuilder.Entity<Poll>()
                .Property(p => p.Id)
                .HasDefaultValueSql("NEWID()");

            modelBuilder.Entity<Option>()
                .Property(o => o.Id)
                .HasDefaultValueSql("NEWID()");

            // Configure relationships between Poll and Option
            modelBuilder.Entity<Poll>()
                .HasMany(p => p.Options)
                .WithOne(o => o.Poll)
                .HasForeignKey(o => o.PollId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationships between Option and Ranking
            modelBuilder.Entity<Option>()
                .HasMany(o => o.Rankings)
                .WithOne(r => r.Option)
                .HasForeignKey(r => r.OptionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
