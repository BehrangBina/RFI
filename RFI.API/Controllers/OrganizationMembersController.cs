using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RFI.API.Data;
using RFI.API.DTOs;
using RFI.API.Models;

namespace RFI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrganizationMembersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrganizationMembersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/organizationmembers (Public - no auth required)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<OrganizationMemberDto>>> GetAllMembers()
        {
            var members = await _context.OrganizationMembers
                .OrderBy(m => m.Id)
                .ToListAsync();

            var memberDtos = BuildHierarchy(members);
            return Ok(memberDtos);
        }

        // GET: api/organizationmembers/{id} (Public - no auth required)
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<OrganizationMemberDto>> GetMember(int id)
        {
            var member = await _context.OrganizationMembers.FindAsync(id);

            if (member == null)
                return NotFound();

            return Ok(MapToDto(member, null));
        }

        // POST: api/organizationmembers
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<OrganizationMemberDto>> CreateMember(CreateOrganizationMemberDto createDto)
        {
            var member = new OrganizationMembers
            {
                Name = createDto.Name,
                Position = createDto.Position,
                Email = createDto.Email,
                Phone = createDto.Phone,
                ImageUrl = createDto.ImageUrl,
                Bio = createDto.Bio,
                ParentId = createDto.ParentId
            };

            _context.OrganizationMembers.Add(member);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMember), new { id = member.Id }, MapToDto(member, null));
        }

        // PUT: api/organizationmembers/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, CreateOrganizationMemberDto updateDto)
        {
            var member = await _context.OrganizationMembers.FindAsync(id);

            if (member == null)
                return NotFound();

            member.Name = updateDto.Name;
            member.Position = updateDto.Position;
            member.Email = updateDto.Email;
            member.Phone = updateDto.Phone;
            member.ImageUrl = updateDto.ImageUrl;
            member.Bio = updateDto.Bio;
            member.ParentId = updateDto.ParentId;

            _context.Entry(member).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await MemberExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/organizationmembers/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            var member = await _context.OrganizationMembers.FindAsync(id);
            if (member == null)
                return NotFound();

            _context.OrganizationMembers.Remove(member);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Helper methods
        private List<OrganizationMemberDto> BuildHierarchy(List<OrganizationMembers> allMembers)
        {
            var roots = new List<OrganizationMemberDto>();

            foreach (var member in allMembers.Where(m => m.ParentId == null))
            {
                roots.Add(MapToDtoWithHierarchy(member, allMembers));
            }

            return roots;
        }

        private OrganizationMemberDto MapToDtoWithHierarchy(OrganizationMembers member, List<OrganizationMembers> allMembers)
        {
            var directReports = allMembers
                .Where(m => m.ParentId == member.Id)
                .Select(m => MapToDtoWithHierarchy(m, allMembers))
                .ToList();

            return MapToDto(member, directReports);
        }

        private OrganizationMemberDto MapToDto(OrganizationMembers member, List<OrganizationMemberDto>? directReports)
        {
            return new OrganizationMemberDto(
                member.Id,
                member.Name ?? "",
                member.Position ?? "",
                member.Email,
                member.Phone,
                member.ImageUrl,
                member.Bio,
                member.ParentId,
                directReports ?? new List<OrganizationMemberDto>()
            );
        }

        private async Task<bool> MemberExists(int id)
        {
            return await _context.OrganizationMembers.AnyAsync(e => e.Id == id);
        }
    }
}
