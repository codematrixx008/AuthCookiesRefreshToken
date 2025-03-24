using API1.Filters;
using API1.Interface;
using API1.Model;
using API1.Service;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API1.Controllers.General
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;

        public AuthController(IAuthService authService, IUserService userService)
        {
            _userService = userService;
            _authService = authService;
        }

        // ✅ Method to store refresh token in cookies
        private void SetRefreshTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,   // Prevent JavaScript access
                Secure = true,     // Use Secure cookie for HTTPS
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7) // Expire in 7 days
            };

            Response.Cookies.Append("RefreshToken", refreshToken, cookieOptions);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var authTokenInstance = _authService.Login(request);
            if (authTokenInstance == null)
                return Unauthorized(new { message = "Invalid credentials" });

            // ✅ Store only the refresh token in cookies
            SetRefreshTokenCookie(authTokenInstance.RefreshToken);

            return Ok(new
            {
                message = "Login successful",
                //accessToken = authTokenInstance.AccessToken
            });
        }

        [HttpPost("refresh")]
        public IActionResult RefreshToken()
        {
            // ✅ Retrieve refresh token from cookie
            var refreshToken = Request.Cookies["RefreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized(new { message = "No refresh token in cookies" });

            var newTokenInstance = _authService.RefreshToken(refreshToken);
            if (newTokenInstance == null)
                return Unauthorized(new { message = "Invalid refresh token" });

            // ✅ Store the new refresh token in cookies
            SetRefreshTokenCookie(newTokenInstance.RefreshToken);

            return Ok(new
            {
                message = "Token refreshed",
                accessToken = newTokenInstance.AccessToken
            });
        }
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("RefreshToken");
            return Ok(new { message = "Logged out successfully" });
        }

    }
}
