package main

import (
	"github.com/gofiber/fiber/v2"
)

// Importa el archivo que contiene la función getLive

func main() {
	// Crea una nueva instancia de la aplicación Fiber
	app := fiber.New()

	// Middleware CORS
	app.Use(func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Method() == "OPTIONS" {
			return c.SendStatus(fiber.StatusNoContent)
		}
		return c.Next()
	})

	//  ---------------- Rutas ----------------

	// --- ROOT ---
	app.Get("/api/", func(c *fiber.Ctx) error {
		return c.SendString("¡Hola, mundo!")
	})

	// --- GET /api/getLive ---
	app.Get("/api/getLive", func(c *fiber.Ctx) error {
		str := getLive()
		return c.SendString(str)
	})

	// Escucha en el puerto 3000
	app.Listen(":3000")
}
