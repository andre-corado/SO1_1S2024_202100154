package main

import (
	"context"
	"fmt"
	"log"
	"net"
	pb "serverGRPC/proto"

	_ "github.com/go-sql-driver/mysql"
	"github.com/segmentio/kafka-go"
	"google.golang.org/grpc"
)

var brokers = []string{"cluster-p2-kafka-bootstrap:9092"}
var topic = "my-topic"

type server struct {
	pb.UnimplementedGetInfoServer
}

const (
	port = ":3001"
)

type Data struct {
	name  string
	album string
	year  string
	rank  string
}

func (s *server) ReturnInfo(ctx context.Context, in *pb.RequestId) (*pb.ReplyInfo, error) {
	fmt.Println("Recibí de cliente: ")
	data := Data{
		name:  in.GetName(),
		album: in.GetAlbum(),
		year:  in.GetYear(),
		rank:  in.GetRank(),
	}
	fmt.Println(data)
	// Enviar a kafka
	sendToKafka(data)
	return &pb.ReplyInfo{Info: "Hola cliente, recibí el album"}, nil
}

func sendToKafka(album Data) {
	// Envía los datos a Kafka
	producer := kafka.NewWriter(kafka.WriterConfig{
		Brokers:  brokers,
		Topic:    topic,
		Balancer: &kafka.LeastBytes{},
	})
	defer producer.Close()

	string := fmt.Sprintf("%s,%s,%s,%s", album.name, album.album, album.year, album.rank)
	// to bytes
	message := []byte(string)

	// Create a Kafka message
	kafkaMessage := kafka.Message{
		Key:   nil,     // You can specify a key if you want
		Value: message, // Your message content
	}

	// Write the message to Kafka
	producer.WriteMessages(context.Background(), kafkaMessage)
	fmt.Println("Mensaje enviado a Kafka")
}

func main() {

	listen, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalln(err)
	}
	s := grpc.NewServer()
	pb.RegisterGetInfoServer(s, &server{})

	if err := s.Serve(listen); err != nil {
		log.Fatalln(err)
	}

	brokers := []string{"cluster-p2-kafka-bootstrap:9092"}
	topic := "my-topic"

	// Create a new producer
	producer := kafka.NewWriter(kafka.WriterConfig{
		Brokers: brokers,
		Topic:   topic,
	})
	if producer != nil {
		log.Fatalf("Error creating producer: %s", err)
	}
	defer producer.Close()
}
