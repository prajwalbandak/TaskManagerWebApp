using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TaskManager.Models;
using TaskManager;
namespace TaskManager.Controllers
{
    public class TasksController : ApiController
    {
        public HttpResponseMessage Get()
        {
            try
            {
                using (TaskManagerEntities2 entities = new TaskManagerEntities2())
                {
                    return Request.CreateResponse(HttpStatusCode.OK, entities.Tasks.ToList());
                }
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }

        }

        [HttpGet]
        [Route("api/Tasks/{userId}")]
        public HttpResponseMessage Get(int userId)
        {
            try
            {
                using (TaskManagerEntities2 entities = new TaskManagerEntities2())
                {
                    // Filter tasks based on the user_id
                    var tasks = entities.Tasks.Where(t => t.user_id == userId).ToList();

                    if (tasks.Count > 0)
                    {
                        return Request.CreateResponse(HttpStatusCode.OK, tasks);
                    }
                    else
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"No tasks found for user with ID {userId}");
                    }
                }
            }
            catch (Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Error retrieving tasks");
            }
        }

     
        // POST api/Tasks
       
        /*public HttpResponseMessage Post([FromBody] Task newTask)
        {
            try
            {
                using (TaskManagerEntities2 entities = new TaskManagerEntities2())
                {
                    // Add the user_id to the new task (assuming newTask already has user_id populated)
                    entities.Tasks.Add(newTask);
                    entities.SaveChanges();

                    // Create a response with HTTP status code 201 Created and include the new task in the response body
                    

                    var message = Request.CreateResponse(HttpStatusCode.Created, newTask);
                    message.Headers.Location = new Uri(Request.RequestUri + newTask.task_id.ToString());
                    return message;

                  //  return response;
                }
            }
            catch (Exception e)
            {
                // If an error occurs, return a HTTP status code 400 Bad Request with an error message
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Error creating new task");
            }
        }*/


        [HttpPut]
        [Route("api/Tasks/Update/{id}")]
        public HttpResponseMessage Update(int id, [FromBody] Task updatedTask)
        {
            try
            {
                using (TaskManagerEntities2 entities = new TaskManagerEntities2())
                {
                    // Check if the task with the given ID exists
                    var existingTask = entities.Tasks.FirstOrDefault(t => t.task_id == id);

                    if (existingTask != null)
                    {
                        // Update the existing task properties
                        existingTask.title = updatedTask.title;
                        existingTask.description = updatedTask.description;
                        existingTask.due_date = updatedTask.due_date;
                        existingTask.status = updatedTask.status;

                        // Save changes to the database
                        entities.SaveChanges();

                        return Request.CreateResponse(HttpStatusCode.OK, existingTask);
                    }
                    else
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Task with ID {id} not found");
                    }
                }
            }
            catch (Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Error updating task");
            }
        }


        // DELETE api/Tasks/5
        [HttpDelete]
        [Route("api/Tasks/Delete/{id}")]
        public HttpResponseMessage Taskdelete(int id)
        {
            try
            {
                using (TaskManagerEntities2 entities = new TaskManagerEntities2())
                {
                    // Find the task with the given ID
                    var taskToDelete = entities.Tasks.FirstOrDefault(t => t.task_id == id);

                    if (taskToDelete != null)
                    {
                        // Remove the task from the database
                        entities.Tasks.Remove(taskToDelete);
                        entities.SaveChanges();

                        return Request.CreateResponse(HttpStatusCode.OK, "Task deleted successfully");
                    }
                    else
                    {
                        // If task with the specified ID is not found, return 404 Not Found
                        return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Task with ID {id} not found");
                    }
                }
            }
            catch (Exception e)
            {
                // If an error occurs, return a HTTP status code 400 Bad Request with an error message
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Error deleting task");
            }
        }

        private string GetBearerToken()
        {
            // Retrieve the Authorization header and extract the bearer token
            string authHeader = Request.Headers.Authorization?.ToString();
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                return authHeader.Substring("Bearer ".Length).Trim();
            }
            return null;
        }

        // POST api/Tasks
        [HttpPost]
        [Route("api/Tasks/Create")]
        public HttpResponseMessage CreateTask([FromBody] Task newTask)
        {
            try
            {
                string token = GetBearerToken();
                Console.WriteLine("token " + token);
                if (string.IsNullOrEmpty(token))
                {
                    return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Missing authorization token");
                }
                string username = TokenManager.ValidateToken(token);
                Console.WriteLine("username " + username);
                if (username == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Invalid or expired token");
                }

                using (TaskManagerEntities1 entitiesUser = new TaskManagerEntities1())
                {

                    var existingUser = entitiesUser.Users.FirstOrDefault(u => u.UserId == newTask.user_id);

                    if (existingUser == null)
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"User with UserId {newTask.user_id} not found");
                    }

                    // Step 4: Check if the authenticated user matches the task's user
                    if (!username.Equals(existingUser.Username, StringComparison.OrdinalIgnoreCase))
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.Forbidden, "You are not authorized to create tasks for this user");
                    }
                }
                    {
                    using (TaskManagerEntities2 entities = new TaskManagerEntities2())
                    {
                        // Add the new task to the database
                        entities.Tasks.Add(newTask);
                        entities.SaveChanges();

                        // After saving, retrieve the updated list of tasks
                        var updatedTasks = entities.Tasks.ToList();

                        // Return HTTP status code 201 Created with the newly created task
                        return Request.CreateResponse(HttpStatusCode.Created, newTask);
                    }
                }
                return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Invalid or expired token");
            }
            catch (Exception e)
            {
                // If an error occurs, return a HTTP status code 400 Bad Request with an error message
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Error creating task");
            }
        }
    }



}


