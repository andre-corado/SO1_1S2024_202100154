package main

import (
	"github.com/gofiber/fiber/v2"
)

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

	// Ruta GET para el endpoint "/"
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("¡Hola, mundo!")
	})

	// Ruta GET para el endpoint "/getLive"
	app.Get("/getLive", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"ram": 66,
			"cpu": 33,
		})
	})

	// Ruta GET para el endpoint "/saludo/:nombre"
	app.Get("/saludo/:nombre", func(c *fiber.Ctx) error {
		nombre := c.Params("nombre")
		return c.SendString("¡Hola, " + nombre + "!")
	})

	// Escucha en el puerto 3000
	app.Listen(":3000")
}
