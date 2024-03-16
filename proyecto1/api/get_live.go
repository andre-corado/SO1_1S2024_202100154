package main

import (
	"fmt"
	"math"
	"os/exec"
	"strconv"
)

// Función que ejecuta un comando y devuelve la salida como un string
func getLive() string {
	// JSON A RETORNAR
	output := ""

	// --------- RAM ---------

	// Comando a ejecutar
	cmd := exec.Command("cat", "/proc/ram_so1_1s2024")
	// Capturar la salida estándar y de error
	stdout, err := cmd.Output()
	if err != nil {
		return fmt.Errorf("error ejecutando el comando: %v", err).Error()
	}
	// Retornar la salida como un string
	output += string(stdout)

	// --------- CPU ---------
	cmd = exec.Command("mpstat")
	// Capturar la salida estándar y de error
	stdout, err = cmd.Output()
	if err != nil {
		return fmt.Errorf("error ejecutando el comando: %v", err).Error()
	}
	stdout = stdout[len(stdout)-6 : len(stdout)-1]
	// stoudt to float
	cpu, err := strconv.ParseFloat(string(stdout), 64)
	if err != nil {
		return fmt.Errorf("error convirtiendo la salida a float: %v", err).Error()
	}
	cpu = float64(100) - cpu
	cpu2 := int(math.Round(cpu))

	// Guardar los ultimos 5 caracteres de la salida
	output += "\"cpu\":" + strconv.FormatInt(int64(cpu2), 10) + ", \"cpuPrecise\":" + strconv.FormatFloat(cpu, 'f', 2, 64) + "}"
	return output
}
