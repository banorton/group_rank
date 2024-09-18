using Microsoft.EntityFrameworkCore;
using YourProjectName.API.Models;

namespace group_rank.API.Data
{
    public class PollContext : DbContext
    {
        public PollContext(DbContextOptions<PollContext> options) : base(options) { }

        public DbSet<Poll> Polls { get; set; }
        public DbSet<Option> Options { get; set; }
    }
}
