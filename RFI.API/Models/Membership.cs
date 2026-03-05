using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace RFI.API.Models;

[ApiController]
[Route("api/[controller]")]
public class Membership
{ 
    public string? Name { get; set; }
    [Required]
    [EmailAddress]
    [Key]
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public DateTime JoinDate { get; set; }
}
