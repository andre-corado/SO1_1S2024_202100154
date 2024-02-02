package main

import (
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type StudentData struct {
	Name     string `json:"name"`
	StudentID string `json:"student_id"`
}

func main() {
	// Configurar la instancia de Fiber
	app := fiber.New()

	// Configurar el middleware CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET, POST, PUT, DELETE",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Crear un manejador para la ruta "/api/data"
	app.Get("/api/data", func(c *fiber.Ctx) error {
		// Crear datos del estudiante
		studentData := StudentData{
			Name:     "Sergio Andre Lima Corado",
			StudentID: "202100154",
		}

		// Convertir datos a JSON
		jsonData, err := json.Marshal(studentData)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Error al convertir datos a JSON")
		}

		// Configurar encabezados de respuesta
		c.Set("Content-Type", "application/json")

		// Enviar datos JSON como respuesta
		return c.Status(fiber.StatusOK).Send(jsonData)
	})

	// Iniciar el servidor en el puerto 8080
	app.Listen(":8080")
}
