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

        // Seed method to insert sample data if none exists
        public static void Seed(PollContext context)
        {
            // Check if any polls exist in the database
            if (!context.Polls.Any())
            {
                // Create a sample poll with options
                var poll = new Poll
                {
                    Title = "Best Pizza Toppings",
                          Options = new List<Option>
                          {
                              new Option { Name = "Pepperoni" },
                              new Option { Name = "Mushrooms" },
                              new Option { Name = "Onions" }
                          }
                };

                // Add the sample poll to the context
                context.Polls.Add(poll);
                // Save the changes to the database
                context.SaveChanges();
            }
        }
    }
}
