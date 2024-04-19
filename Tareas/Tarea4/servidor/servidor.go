package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net"
	pb "serverGRPC/proto"

	_ "github.com/go-sql-driver/mysql"
	"google.golang.org/grpc"
)

var ctx = context.Background()
var db *sql.DB

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

func mysqlConnect() {
	// Cambia las credenciales según tu configuración de MySQL
	dsn := "root:admin@tcp(34.86.150.127:3306)/tarea4"

	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalln(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println("Conexión a MySQL exitosa")
}

func (s *server) ReturnInfo(ctx context.Context, in *pb.RequestId) (*pb.ReplyInfo, error) {
	fmt.Println("Recibí de cliente: ", in.GetRank())
	data := Data{
		name:  in.GetName(),
		album: in.GetAlbum(),
		year:  in.GetYear(),
		rank:  in.GetRank(),
	}
	fmt.Println(data)
	insertMySQL(data)
	return &pb.ReplyInfo{Info: "Hola cliente, recibí el album"}, nil
}

func insertMySQL(album Data) {
	// Prepara la consulta SQL para la inserción en MySQL
	query := "INSERT INTO albums (band_name, album_name, release_year, ranking) VALUES (?, ?, ?, ?)"
	_, err := db.ExecContext(ctx, query, album.name, album.album, album.year, album.rank)
	if err != nil {
		log.Println("Error al insertar en MySQL:", err)
	}
}

func main() {
	listen, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalln(err)
	}
	s := grpc.NewServer()
	pb.RegisterGetInfoServer(s, &server{})

	mysqlConnect()

	if err := s.Serve(listen); err != nil {
		log.Fatalln(err)
	}
}
