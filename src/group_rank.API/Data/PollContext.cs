using Microsoft.EntityFrameworkCore;
using System.Linq;
using group_rank.API.Models;

namespace group_rank.API.Data
{
    public class PollContext : DbContext
    {
        public PollContext(DbContextOptions<PollContext> options) : base(options) { }

        public DbSet<Poll> Polls { get; set; }
        public DbSet<Option> Options { get; set; }
    }
}
