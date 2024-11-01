package alog

import (
	"encoding/json"
	"io"
	"log"
	"os"
	"sync"
)

type syncWriter struct {
	format string
	mu     sync.Mutex
	w      io.Writer
}

func encoder(i *LogEntry) ([]byte, error) {
	return json.Marshal(i)
}

func (sw *syncWriter) write(i *LogEntry) {
	data, err := encoder(i)
	if err != nil {
		log.Fatal(err)
	}
	sw.mu.Lock()
	defer sw.mu.Unlock()
	_, err = sw.w.Write(data)
	if err != nil {
		log.Fatal(err)
	}
}

func newDefaultWriter() *syncWriter {
	return &syncWriter{w: os.Stderr}
}
