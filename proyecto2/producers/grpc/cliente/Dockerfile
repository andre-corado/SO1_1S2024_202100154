FROM golang:alpine as golang

WORKDIR /app
COPY . .

RUN go mod download
RUN go mod verify

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /client .

FROM gcr.io/distroless/static-debian11

COPY --from=golang /client .

EXPOSE 3000

CMD ["/client"]

