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

        _context.Polls.Add(poll);
        _context.SaveChanges();

        // Return a generated link for the poll
        return Ok(new { Link = $"https://localhost:5166/poll/{poll.Id}" });
    }

    // GET: api/poll/{id}
    [HttpGet("{id}")]
    public IActionResult GetPoll(int id)
    {
        var poll = _context.Polls.Include(p => p.Options).FirstOrDefault(p => p.Id == id);

        if (poll == null)
        {
            return NotFound();
        }

        return Ok(poll);
    }

    // POST: api/poll/{id}/rank
    [HttpPost("{id}/rank")]
    public IActionResult SubmitRanking(int id, [FromBody] List<OptionRanking> rankings)
    {
        var poll = _context.Polls.Include(p => p.Options).FirstOrDefault(p => p.Id == id);

        if (poll == null)
        {
            return NotFound();
        }

        foreach (var ranking in rankings)
        {
            var option = poll.Options.FirstOrDefault(o => o.Id == ranking.OptionId);
            if (option != null)
            {
                option.Rankings.Add(ranking.Rank); // Store ranking (e.g., points for Borda Count)
            }
        }

        _context.SaveChanges();

        return Ok("Rankings submitted.");
    }

    // PUT: api/poll/{id}/finish
    [HttpPut("{id}/finish")]
    public IActionResult FinishPoll(int id)
    {
        var poll = _context.Polls.Include(p => p.Options).FirstOrDefault(p => p.Id == id);

        if (poll == null)
        {
            return NotFound();
        }

        poll.IsFinished = true;

        // Calculate rankings (for simplicity, we assume the Borda Count here)
        var results = poll.Options.Select(o => new
        {
            Option = o.Name,
            Points = o.Rankings.Sum()
        }).OrderByDescending(o => o.Points);

        _context.SaveChanges();

        return Ok(new { Results = results });
    }
}
