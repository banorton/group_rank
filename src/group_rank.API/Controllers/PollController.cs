using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using group_rank.API.Models;
using group_rank.API.Data;

[Route("api/[controller]")]
[ApiController]
public class PollController : ControllerBase
{
    private readonly PollContext _context;

    public PollController(PollContext context)
    {
        _context = context;
    }

    // Handle preflight CORS requests (optional but useful for debugging)
    [HttpOptions]
    public IActionResult Preflight()
    {
        return Ok();
    }

    // POST: api/poll
    [HttpPost]
    public IActionResult CreatePoll([FromBody] Poll poll)
    {
        if (poll == null || poll.Options == null || poll.Options.Count == 0)
        {
            return BadRequest("Invalid poll data.");
        }

        // Set GUIDs for Options if not set
        foreach (var option in poll.Options)
        {
            if (option.Id == Guid.Empty)
            {
                option.Id = Guid.NewGuid();
            }
        }

        _context.Polls.Add(poll);
        _context.SaveChanges();

        // Return a generated link for the poll
        return Ok(new
        {
            pollId = poll.Id,
            link = $"https://localhost:5166/poll/{poll.Id}"
        });
    }

    // GET: api/poll/{id}
    [HttpGet("{id}")]
    public IActionResult GetPoll(Guid id)
    {
        var poll = _context.Polls
            .Include(p => p.Options)
            .FirstOrDefault(p => p.Id == id);

        if (poll == null)
        {
            return NotFound();
        }

        return Ok(poll);
    }

    // POST: api/poll/{id}/submit-rankings
    [HttpPost("{id}/submit-rankings")]
    public async Task<IActionResult> SubmitRankings(Guid id, [FromBody] List<RankingSubmission> rankings)
    {
        if (rankings == null || !rankings.Any())
        {
            return BadRequest("Rankings cannot be null or empty.");
        }

        // Retrieve the poll and include options
        var poll = await _context.Polls
            .Include(p => p.Options)
            .ThenInclude(o => o.Rankings)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (poll == null)
        {
            return NotFound("Poll not found.");
        }

        foreach (var rankingSubmission in rankings)
        {
            var option = poll.Options.FirstOrDefault(o => o.Id == rankingSubmission.OptionId);
            if (option != null)
            {
                var newRanking = new Ranking
                {
                    OptionId = option.Id,
                    Rank = rankingSubmission.Rank
                };
                option.Rankings.Add(newRanking);
            }
            else
            {
                return BadRequest($"Option with ID {rankingSubmission.OptionId} not found in this poll.");
            }
        }

        await _context.SaveChangesAsync();

        return Ok("Rankings submitted successfully.");
    }

    // POST: api/poll/{id}/end
    [HttpPost("{id}/end")]
    public async Task<IActionResult> EndPoll(Guid id)
    {
        var poll = await _context.Polls.FindAsync(id);

        if (poll == null)
        {
            return NotFound("Poll not found.");
        }

        poll.IsFinished = true;
        await _context.SaveChangesAsync();

        return Ok("Poll ended successfully.");
    }

    // GET: api/poll/{id}/results
    [HttpGet("{id}/results")]
    public async Task<ActionResult<List<OptionResultDto>>> GetPollResults(Guid id)
    {
        var poll = await _context.Polls
            .Include(p => p.Options)
            .ThenInclude(o => o.Rankings)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (poll == null)
        {
            return NotFound("Poll not found.");
        }

        if (!poll.IsFinished)
        {
            return BadRequest("Poll is not yet finished.");
        }

        // Calculate average rank for each option
        var optionsWithAverageRank = poll.Options.Select(o => new OptionResultDto
        {
            Id = o.Id,
            Name = o.Name,
            AverageRank = o.Rankings.Any() ? o.Rankings.Average(r => r.Rank) : double.MaxValue
        }).ToList();

        // Order options by average rank
        var orderedOptions = optionsWithAverageRank.OrderBy(o => o.AverageRank).ToList();

        return Ok(orderedOptions);
    }
}
