package main

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/go-redis/redis/v8"
	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var brokers = []string{"cluster-p2-kafka-bootstrap:9092"}
var topic = "my-topic"

type Voto struct {
	Name  string
	Album string
	Year  string
	Rank  string
}

type VotoMongo struct {
	Name  string `json:"name"`
	Album string `json:"album"`
	Year  string `json:"year"`
	Rank  string `json:"rank"`
}

func SaveToMongoDB(voto *Voto) {
	// Establecer la conexión con MongoDB
	clientOptions := options.Client().ApplyURI("mongodb://34.123.198.237:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}
	collection := client.Database("p2").Collection("votos")
	fmt.Println("Conexión establecida con MongoDB")

	votoMongo := VotoMongo{
		Name:  voto.Name,
		Album: voto.Album,
		Year:  voto.Year,
		Rank:  voto.Rank,
	}

	// Convertir el voto a un documento BSON
	votoDoc, err := bson.Marshal(votoMongo)
	if err != nil {
		log.Fatal(err)
	}
	// Insertar el documento BSON en la colección
	_, err = collection.InsertOne(context.Background(), votoDoc)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Documento insertado exitosamente en la colección 'votos' de la base de datos 'p2'")

	// Cerrar la conexión con MongoDB
	err = client.Disconnect(context.Background())
	if err != nil {
		log.Fatal(err)
	}
}

func SaveToRedis(voto *Voto) {
	// Conexión a Redis
	ctx := context.Background()
	rdb := redis.NewClient(&redis.Options{
		Addr:     "35.226.58.104:6379", // Cambia esto según tu configuración de Redis
		Password: "",                   // Configura si se requiere autenticación
		DB:       0,                    // Usa el DB predeterminado
	})

	// Incrementar el contador del voto para el artista en Redis
	err := rdb.HIncrBy(ctx, "votos_artistas", voto.Name, 1).Err()
	if err != nil {
		fmt.Println("Error al incrementar el contador del voto para el artista:", err)
		return
	}

	// Incrementar el contador del voto para el álbum en Redis
	err = rdb.HIncrBy(ctx, "votos_albumes", voto.Album, 1).Err()
	if err != nil {
		fmt.Println("Error al incrementar el contador del voto para el álbum:", err)
		return
	}

	// Número de votos totales
	err = rdb.Incr(ctx, "votos_total").Err()
	if err != nil {
		fmt.Println("Error al incrementar el contador de votos totales:", err)
		return
	}

	fmt.Println("Voto almacenado exitosamente en Redis")

}

func ReadMessage(reader *kafka.Reader) *Voto {
	// Read a message from Kafka
	message, err := reader.ReadMessage(context.Background())
	if err != nil {
		log.Fatalf("Error reading message: %s", err)
		return nil
	}

	fmt.Println("Recibí un voto:")
	words := strings.Split(string(message.Value), ",")
	// Crear un voto con los datos separados
	voto := Voto{
		Name:  words[0],
		Album: words[1],
		Year:  words[2],
		Rank:  words[3],
	}
	fmt.Printf("Nombre: %s, Album: %s, Año: %s, Ranking: %s\n", voto.Name, voto.Album, voto.Year, voto.Rank)

	return &voto

}

func main() {
	// Create Kafka reader
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: brokers,
		Topic:   topic,
		GroupID: "vote-consumer",
	})

	for {
		voto := ReadMessage(reader)
		if voto != nil {
			fmt.Println("Enviando voto a DB's...")
			// Guardar en DB's
			SaveToMongoDB(voto)
			SaveToRedis(voto)
			// División
			fmt.Println("\n---------------------------------\n\n")

		}

	}
}
