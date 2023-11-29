using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System.Collections.Generic;
using System.Data;
using Project4.Models;

namespace Project4.Controllers
///weatherforecast/GetVehiculos
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly string _connectionString;

        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpGet("GetVehiculos")]
        public ActionResult<List<Vehiculo>> GetVehiculos()
        {
            List<Vehiculo> listaVehiculos = new List<Vehiculo>();

            using (var connection = new MySqlConnection(_connectionString))
            {
                connection.Open();
                var query = "SELECT * FROM Vehiculos";

                using (var command = new MySqlCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var vehiculo = new Vehiculo
                            {
                                idVehiculos = reader.GetInt32("idVehiculos"),
                                Marca = reader.IsDBNull(reader.GetOrdinal("Marca")) ? null : reader.GetString("Marca"),
                                Modelo = reader.IsDBNull(reader.GetOrdinal("Modelo")) ? null : reader.GetString("Modelo"),
                                Anio = reader.IsDBNull(reader.GetOrdinal("Anio")) ? null : reader.GetString("Anio"),
                                Kilometraje = reader.IsDBNull(reader.GetOrdinal("Kilometraje")) ? null : reader.GetString("Kilometraje"),
                                idCliente = reader.IsDBNull(reader.GetOrdinal("idCliente")) ? null : reader.GetString("idCliente")
                            };
                            listaVehiculos.Add(vehiculo);
                        }
                    }
                }
            }

            return listaVehiculos;
        }

        [HttpPost("AddVehiculo")]
        public ActionResult AddVehiculo([FromBody] Vehiculo newVehiculo)
        {
            // Validación básica del modelo recibido
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validación adicional para asegurarse de que el idVehiculos no esté vacío o null
            if (newVehiculo.idVehiculos == 0)
            {
                return BadRequest("El ID del vehículo es requerido.");
            }

            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    connection.Open();
                    var query = "INSERT INTO Vehiculos (idVehiculos, Marca, Modelo, Anio, Kilometraje, idCliente) VALUES (@idVehiculos, @Marca, @Modelo, @Anio, @Kilometraje, @idCliente)";

                    using (var command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@idVehiculos", newVehiculo.idVehiculos);
                        command.Parameters.AddWithValue("@Marca", newVehiculo.Marca);
                        command.Parameters.AddWithValue("@Modelo", newVehiculo.Modelo);
                        command.Parameters.AddWithValue("@Anio", newVehiculo.Anio);
                        command.Parameters.AddWithValue("@Kilometraje", newVehiculo.Kilometraje);
                        command.Parameters.AddWithValue("@idCliente", newVehiculo.idCliente); // Manejar nulls para idCliente

                        var result = command.ExecuteNonQuery();

                        if (result > 0)
                        {
                            return Ok(new { Message = "Vehículo agregado con éxito.", idVehiculos = newVehiculo.idVehiculos });
                        }
                        else
                        {
                            return BadRequest("No se pudo agregar el vehículo.");
                        }
                    }
                }
            }
            catch (MySqlException ex) when (ex.Number == 1062) // Duplicado de entrada
            {
                return Conflict("Ya existe un vehículo con el mismo ID.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al agregar el vehículo");
                return StatusCode(500, "Error interno del servidor");
            }
        }
        [HttpPut("UpdateVehiculo/{id}")]
        public ActionResult UpdateVehiculo(int id, [FromBody] Vehiculo vehiculo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    connection.Open();
                    var query = "UPDATE Vehiculos SET idVehiculos = @idVehiculos, Marca = @Marca, Modelo = @Modelo, Anio = @Anio, Kilometraje = @Kilometraje, idCliente = @idCliente WHERE idVehiculos = @idVehiculos";

                    using (var command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@idVehiculos", vehiculo.idVehiculos);
                        command.Parameters.AddWithValue("@Marca", vehiculo.Marca);
                        command.Parameters.AddWithValue("@Modelo", vehiculo.Modelo);
                        command.Parameters.AddWithValue("@Anio", vehiculo.Anio);
                        command.Parameters.AddWithValue("@Kilometraje", vehiculo.Kilometraje);
                        command.Parameters.AddWithValue("@idCliente", vehiculo.idCliente);

                        var result = command.ExecuteNonQuery();

                        if (result > 0)
                        {
                            return Ok(new { Message = "Vehículo actualizado con éxito." });
                        }
                        else
                        {
                            return NotFound(new { Message = "Vehículo no encontrado." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar el vehículo");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        [HttpDelete("DeleteVehiculo/{id}")]
        public ActionResult DeleteVehiculo(int id)
        {
            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    connection.Open();
                    var query = "DELETE FROM Vehiculos WHERE idVehiculos = @idVehiculos";

                    using (var command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@idVehiculos", id);

                        var result = command.ExecuteNonQuery();

                        if (result > 0)
                        {
                            return Ok(new { Message = "Vehículo eliminado con éxito." });
                        }
                        else
                        {
                            return NotFound(new { Message = "Vehículo no encontrado." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar el vehículo");
                return StatusCode(500, "Error interno del servidor");
            }
        }
        [HttpGet("GetVehiculo/{id}")]
public ActionResult<Vehiculo> GetVehiculo(int id)
{
    using (var connection = new MySqlConnection(_connectionString))
    {
        connection.Open();
        var query = "SELECT * FROM Vehiculos WHERE idVehiculos = @idVehiculos";

        using (var command = new MySqlCommand(query, connection))
        {
            command.Parameters.AddWithValue("@idVehiculos", id);
            using (var reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    var vehiculo = new Vehiculo
                    {
                        idVehiculos = reader.GetInt32("idVehiculos"),
                        Marca = reader.GetString("Marca"),
                        Modelo = reader.GetString("Modelo"),
                        Anio = reader.GetString("Anio"),
                        Kilometraje = reader.GetString("Kilometraje"),
                        idCliente = reader.GetString("idCliente")
                    };
                    return Ok(vehiculo);
                }
                else
                {
                    return NotFound();
                }
            }
        }
    }
}

        [HttpPost("AddServicio")]
public ActionResult AddServicio([FromBody] Servicio newServicio)
{
    // Validación básica del modelo recibido
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    try
    {
        using (var connection = new MySqlConnection(_connectionString))
        {
            connection.Open();
            var query = "INSERT INTO servicio (idServicio, idVehiculo, Nombre, Fecha, Asignado, Descripcion, Costo) VALUES (@idServicio, @idVehiculo, @Nombre, @Fecha, @Asignado, @Descripcion, @Costo)";

            using (var command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@idServicio", newServicio.idServicio);
                command.Parameters.AddWithValue("@idVehiculo", newServicio.idVehiculo);
                command.Parameters.AddWithValue("@Nombre", newServicio.Nombre);
                command.Parameters.AddWithValue("@Fecha", newServicio.Fecha);
                command.Parameters.AddWithValue("@Asignado", newServicio.Asignado);
                command.Parameters.AddWithValue("@Descripcion", newServicio.Descripcion);
                command.Parameters.AddWithValue("@Costo", newServicio.Costo);

                var result = command.ExecuteNonQuery();

                if (result > 0)
                {
                    return Ok(new { Message = "Servicio agregado con éxito." });
                }
                else
                {
                    return BadRequest("No se pudo agregar el servicio.");
                }
            }
        }
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error al agregar el servicio");
        return StatusCode(500, "Error interno del servidor");
    }
}

// Actualizar un servicio existente
[HttpPut("UpdateServicio/{id}")]
public ActionResult UpdateServicio(int id, [FromBody] Servicio servicio)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    try
    {
        using (var connection = new MySqlConnection(_connectionString))
        {
            connection.Open();
            var query = "UPDATE servicio SET idServicio = @idServicio,   idVehiculo = @idVehiculo, Nombre = @Nombre, Fecha = @Fecha, Asignado = @Asignado, Descripcion = @Descripcion, Costo = @Costo WHERE idServicio = @idServicio";

            using (var command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@idServicio", id);
                command.Parameters.AddWithValue("@idVehiculo", servicio.idVehiculo);
                command.Parameters.AddWithValue("@Nombre", servicio.Nombre);
                command.Parameters.AddWithValue("@Fecha", servicio.Fecha);
                command.Parameters.AddWithValue("@Asignado", servicio.Asignado);
                command.Parameters.AddWithValue("@Descripcion", servicio.Descripcion);
                command.Parameters.AddWithValue("@Costo", servicio.Costo);

                var result = command.ExecuteNonQuery();

                if (result > 0)
                {
                    return Ok(new { Message = "Servicio actualizado con éxito." });
                }
                else
                {
                    return NotFound(new { Message = "Servicio no encontrado." });
                }
            }
        }
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error al actualizar el servicio");
        return StatusCode(500, "Error interno del servidor");
    }
}

// Eliminar un servicio
[HttpDelete("DeleteServicio/{id}")]
public ActionResult DeleteServicio(int id)
{
    try
    {
        using (var connection = new MySqlConnection(_connectionString))
        {
            connection.Open();
            var query = "DELETE FROM servicio WHERE idServicio = @idServicio";

            using (var command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@idServicio", id);

                var result = command.ExecuteNonQuery();

                if (result > 0)
                {
                    return Ok(new { Message = "Servicio eliminado con éxito." });
                }
                else
                {
                    return NotFound(new { Message = "Servicio no encontrado." });
                }
            }
        }
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error al eliminar el servicio");
        return StatusCode(500, "Error interno del servidor");
    }
}
        [HttpGet("GetServicios")]
        public ActionResult<List<Servicio>> GetServicios()
        {
            List<Servicio> listaServicios = new List<Servicio>();

            using (var connection = new MySqlConnection(_connectionString))
            {
                connection.Open();
                var query = "SELECT * FROM servicio";

                using (var command = new MySqlCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var servicio = new Servicio
                            {
                                idServicio = reader.GetInt32("idServicio"),
                                idVehiculo = reader.GetInt32("idVehiculo"),
                                Nombre = reader.GetString("Nombre"),
                                Fecha = reader.GetString("Fecha"),
                                Asignado = reader.GetString("Asignado"),
                                Descripcion = reader.GetString("Descripcion"),
                                Costo = reader.GetString("Costo")
                            };
                            listaServicios.Add(servicio);
                        }
                    }
                }
            }

            return listaServicios;
        }

        // Obtener un servicio por ID
        [HttpGet("GetServicio/{id}")]
        public ActionResult<Servicio> GetServicio(int id)
        {
            using (var connection = new MySqlConnection(_connectionString))
            {
                connection.Open();
                var query = "SELECT * FROM servicio WHERE idServicio = @idServicio";

                using (var command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@idServicio", id);
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var servicio = new Servicio
                            {
                                idServicio = reader.GetInt32("idServicio"),
                                idVehiculo = reader.GetInt32("idVehiculo"),
                                Nombre = reader.GetString("Nombre"),
                                Fecha = reader.GetString("Fecha"),
                                Asignado = reader.GetString("Asignado"),
                                Descripcion = reader.GetString("Descripcion"),
                                Costo = reader.GetString("Costo")
                            };
                            return Ok(servicio);
                        }
                        else
                        {
                            return NotFound();
                        }
                    }
                }
            }
        }
        [HttpPost("AddRefaccion")]
        public ActionResult AddRefaccion([FromBody] Refaccion newRefaccion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var connection = new MySqlConnection(_connectionString))
            {
                connection.Open();
                var query = "INSERT INTO refacciones (idRefacciones, Nombre, Descripcion, Costo) VALUES (@idRefacciones, @Nombre, @Descripcion, @Costo)";

                using (var command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@idRefacciones", newRefaccion.idRefacciones);
                    command.Parameters.AddWithValue("@Nombre", newRefaccion.Nombre);
                    command.Parameters.AddWithValue("@Descripcion", newRefaccion.Descripcion);
                    command.Parameters.AddWithValue("@Costo", newRefaccion.Costo);

                    var result = command.ExecuteNonQuery();

                    if (result > 0)
                    {
                        return Ok(new { Message = "Refacción agregada con éxito." });
                    }
                    else
                    {
                        return BadRequest("No se pudo agregar la refacción.");
                    }
                }
            }
        }

        [HttpPut("UpdateRefaccion/{id}")]
        public ActionResult UpdateRefaccion(int id, [FromBody] Refaccion refaccion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var connection = new MySqlConnection(_connectionString))
            {
                connection.Open();
                var query = "UPDATE refacciones SET idRefacciones = @idRefacciones, Nombre = @Nombre, Descripcion = @Descripcion, Costo = @Costo WHERE idRefacciones = @idRefacciones";

                using (var command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@idRefacciones", refaccion.idRefacciones);
                    command.Parameters.AddWithValue("@Nombre", refaccion.Nombre);
                    command.Parameters.AddWithValue("@Descripcion", refaccion.Descripcion);
                    command.Parameters.AddWithValue("@Costo", refaccion.Costo);

                    var result = command.ExecuteNonQuery();

                    if (result > 0)
                    {
                        return Ok(new { Message = "Refacción actualizada con éxito." });
                    }
                    else
                    {
                        return NotFound(new { Message = "Refacción no encontrada." });
                    }
                }
            }
        }

        [HttpDelete("DeleteRefaccion/{id}")]
        public ActionResult DeleteRefaccion(int id)
        {
            using (var connection = new MySqlConnection(_connectionString))
            {
                connection.Open();
                var query = "DELETE FROM refacciones WHERE idRefacciones = @idRefacciones";

                using (var command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@idRefacciones", id);

                    var result = command.ExecuteNonQuery();

                    if (result > 0)
                    {
                        return Ok(new { Message = "Refacción eliminada con éxito." });
                    }
                    else
                    {
                        return NotFound(new { Message = "Refacción no encontrada." });
                    }
                }
            }
        }
        [HttpGet("GetRefacciones")]
        public ActionResult<List<Refaccion>> GetRefacciones()
        {
            List<Refaccion> listaRefacciones = new List<Refaccion>();

            using (var connection = new MySqlConnection(_connectionString))
            {
                connection.Open();
                var query = "SELECT * FROM refacciones";

                using (var command = new MySqlCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var refaccion = new Refaccion
                            {
                                idRefacciones = reader.GetInt32("idRefacciones"),
                                Nombre = reader.GetString("Nombre"),
                                Descripcion = reader.GetString("Descripcion"),
                                Costo = reader.GetString("Costo")
                            };
                            listaRefacciones.Add(refaccion);
                        }
                    }
                }
            }

            return listaRefacciones;
        }

        [HttpGet("GetRefaccion/{id}")]
        public ActionResult<Refaccion> GetRefaccion(int id)
        {
            using (var connection = new MySqlConnection(_connectionString))
            {
                connection.Open();
                var query = "SELECT * FROM refacciones WHERE idRefacciones = @idRefacciones";

                using (var command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@idRefacciones", id);

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var refaccion = new Refaccion
                            {
                                idRefacciones = reader.GetInt32("idRefacciones"),
                                Nombre = reader.GetString("Nombre"),
                                Descripcion = reader.GetString("Descripcion"),
                                Costo = reader.GetString("Costo")
                            };
                            return Ok(refaccion);
                        }
                        else
                        {
                            return NotFound();
                        }
                    }
                }
            }
        }
        [HttpGet("GetServicioConRefacciones/{idServicio}")]
        public ActionResult GetServicioConRefacciones(int idServicio)
        {
            using (var connection = new MySqlConnection(_connectionString))
            {
                connection.Open();
                var query = @"
            SELECT 
                s.idServicio,
                s.Nombre,
                s.Fecha,
                s.Asignado,
                s.Descripcion AS DescripcionServicio,
                s.Costo AS CostoServicio,
                r.idRefacciones,
                r.Nombre AS NombreRefaccion,
                r.Descripcion AS DescripcionRefaccion,
                r.Costo AS CostoRefaccion,
                sr.Estatus
            FROM servicio s
            JOIN servicio_refacciones sr ON s.idServicio = sr.idServicio
            JOIN refacciones r ON sr.idRefacciones = r.idRefacciones
            WHERE s.idServicio = @idServicio";

                using (var command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@idServicio", idServicio);
                    using (var reader = command.ExecuteReader())
                    {
                        var serviciosConRefacciones = new List<object>();
                        while (reader.Read())
                        {
                            serviciosConRefacciones.Add(new
                            {
                                idServicio = reader.GetInt32("idServicio"),
                                Nombre = reader.GetString("Nombre"),
                                Fecha = reader.GetString("Fecha"),
                                Asignado = reader.GetString("Asignado"),
                                DescripcionServicio = reader.GetString("DescripcionServicio"),
                                CostoServicio = reader.GetString("CostoServicio"),
                                idRefacciones = reader.GetString("idRefacciones"),
                                NombreRefaccion = reader.GetString("NombreRefaccion"),
                                DescripcionRefaccion = reader.GetString("DescripcionRefaccion"),
                                CostoRefaccion = reader.GetString("CostoRefaccion"),
                                Estatus = reader.GetString("Estatus")
                            });
                        }
                        return Ok(serviciosConRefacciones);
                    }
                }
            }
        }
    }

}