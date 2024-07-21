using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TaskManager.Models;
using System.Web.Http.Cors;
namespace TaskManager.Controllers

{
    public class UsersController : ApiController
    {


        [HttpPost]
        [Route("api/Users/register")]
        public HttpResponseMessage Useregister([FromBody] User user)
        {
            try
            {
                using (TaskManagerEntities1 entities = new TaskManagerEntities1())
                {
                    // Check if the username is already taken
                    var existingUser = entities.Users.FirstOrDefault(u => u.Username == user.Username);
                    if (existingUser != null)
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Username already exists. Please choose a different username.");
                    }

                    // Add user to database
                    entities.Users.Add(user);
                    entities.SaveChanges();

                    var message = Request.CreateResponse(HttpStatusCode.Created, user);
                    message.Headers.Location = new Uri(Request.RequestUri + user.UserId.ToString());
                    return message;
                }
            }
            catch (DbUpdateException ex)
            {
                // Log the exception here for debugging purposes
                Console.WriteLine(ex.ToString());

                // Handle specific error cases if needed
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Failed to update the database. Please check your input and try again.");
            }
            catch (Exception ex)
            {
                // Log any unexpected exceptions here
                Console.WriteLine(ex.ToString());

                // Return a generic error response
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "An unexpected error occurred. Please try again later.");
            }
        }


        [HttpPost]
        [Route("api/Users/login")] // Route attribute for clarity
        public HttpResponseMessage Login([FromBody] LoginModel model)
        {
            try
            {
                using (TaskManagerEntities1 entities = new TaskManagerEntities1())
                {
                    // Perform authentication based on model.Username and model.Password
                    var user = entities.Users.FirstOrDefault(u => u.Username == model.Username && u.PasswordHash == model.Password);


                    if (user != null)
                    {
                        // Create JWT token for authenticated user (if needed)
                        string token = TokenManager.GenerateToken(model.Username);

                        // Return success response with token
                        return Request.CreateResponse(HttpStatusCode.OK, new { Token = token, user_id = user.UserId });
                    }
                    else
                    {
                        // Return unauthorized response if user not found
                        return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Invalid username or password.");
                    }
                }
            }
            catch (Exception ex)
            {
                // Log any unexpected exceptions here
                Console.WriteLine(ex.ToString());

                // Return a generic error response
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "An unexpected error occurred. Please try again later.");
            }
        }

        [HttpPost]
        [Route("api/Users/logout")]
        public HttpResponseMessage Logout()
        {
            try
            {
                // In a typical JWT-based authentication scenario, there's no server-side session to invalidate directly
                // Logout operation usually involves actions on the client side, such as clearing the token from local storage or cookies
                // Optionally, you can implement token invalidation logic on the server side (e.g., using a blacklist)

                // For example, return a success response indicating logout was successful
                return Request.CreateResponse(HttpStatusCode.OK, "Logout successful");
            }
            catch (Exception ex)
            {
                // Log any unexpected exceptions here
                Console.WriteLine(ex.ToString());

                // Return a generic error response
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "An unexpected error occurred. Please try again later.");
            }
        }












    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
