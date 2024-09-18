using System.Collections.Generic;

namespace group_rank.API.Models
{
    public class Poll
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool IsFinished { get; set; }
        public List<Option> Options { get; set; }
    }

    public class Option
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<int> Rankings { get; set; } = new List<int>(); // Stores rankings (e.g., points)
    }

    public class OptionRanking
    {
        public int OptionId { get; set; }
        public int Rank { get; set; } // 1st place, 2nd place, etc.
    }
}
