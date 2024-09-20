using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace group_rank.API.Models
{
    public class Poll
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Title { get; set; }

        public bool IsFinished { get; set; }
        public required List<Option> Options { get; set; }
    }

    public class Option
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public List<Ranking> Rankings { get; set; } = new List<Ranking>();

        [NotMapped]
        public double AverageRank { get; set; } // Computed property, not stored in the database
    }

    public class Ranking
    {
        public int Id { get; set; }
        public int OptionId { get; set; }
        public Option? Option { get; set; } // Made nullable
        public int Rank { get; set; }
    }

    public class RankingSubmission
    {
        public int OptionId { get; set; }
        public int Rank { get; set; } // 1st place, 2nd place, etc.
    }

    public class OptionResultDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public double AverageRank { get; set; }
    }
}
