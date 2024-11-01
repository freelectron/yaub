package alog

import (
	"context"
	"fmt"
	"os"
	"time"
)

var (
	DefaultWriter *syncWriter
)

type LogEntry struct {
	Exe       string    `json:"exe"`
	TimeStamp time.Time `json:"timeStamp"`
	LevelName string    `json:"levelName"`
	Message   string    `json:"message"`
}

func MustRedirectDefaultLogger(outputFile string) {
	file, err := os.OpenFile(outputFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		panic(err)
	}
	DefaultWriter.w = file
}

func init() {
	DefaultWriter = newDefaultWriter()
}

////////////////////////////////////////////////////////
// TODO: use context to provide more info about the log
////////////////////////////////////////////////////////

func Info(ctx context.Context, format string, v ...interface{}) {
	DefaultWriter.write(&LogEntry{
		Exe:       os.Args[0],
		TimeStamp: time.Now(),
		LevelName: "INFO",
		Message:   fmt.Sprintf(format, v...),
	})
}

func Warning(ctx context.Context, format string, v ...interface{}) {
	DefaultWriter.write(&LogEntry{
		Exe:       os.Args[0],
		TimeStamp: time.Now(),
		LevelName: "WARNING",
		Message:   fmt.Sprintf(format, v...),
	})
}
func Error(ctx context.Context, format string, v ...interface{}) {
	DefaultWriter.write(&LogEntry{
		Exe:       os.Args[0],
		TimeStamp: time.Now(),
		LevelName: "ERROR",
		Message:   fmt.Sprintf(format, v...),
	})
}
func Fatal(ctx context.Context, format string, v ...interface{}) {
	DefaultWriter.write(&LogEntry{
		Exe:       os.Args[0],
		TimeStamp: time.Now(),
		LevelName: "FATAL",
		Message:   fmt.Sprintf(format, v...),
	})
	os.Exit(1)
}
