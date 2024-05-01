package main

import (
	"context"
	"fmt"
	"log"
	"net"
	pb "serverGRPC/proto"

	_ "github.com/go-sql-driver/mysql"
	"google.golang.org/grpc"
)

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
	return
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
}
