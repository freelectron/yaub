FROM golang:1.23-alpine as base

WORKDIR /build

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o ./backend

EXPOSE 3001

CMD ["./backend"]