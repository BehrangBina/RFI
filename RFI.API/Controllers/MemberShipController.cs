using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.DTOs;
using RFI.API.Models;

namespace RFI.API.Controllers;

public class MemberShipController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MemberShipController(ApplicationDbContext context)
    {
        _context = context;
    }
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] MembershipDto dto)
    {
        // Check if email already exists
        var existingMember = await _context.Memberships
            .FirstOrDefaultAsync(m => m.Email == dto.Email);
        
        if (existingMember != null)
        {
            return Conflict(new { message = "Email already registered" });
        }
        
        var membership = new Membership
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            JoinDate = DateTime.UtcNow
        };
        
        _context.Memberships.Add(membership);
        await _context.SaveChangesAsync();
        
        return Ok(new { message = "Registration successful" });
    }


}
