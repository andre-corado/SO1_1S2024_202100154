package main

import (
	"context"
	"fmt"
	"log"
	"strings"

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
			// División
			fmt.Println("\n\n---------------------------------\n\n")

		}

	}
}
