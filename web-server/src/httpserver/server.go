package httpserver

import (
	"net/http"
	"strconv"
)

func Start(port int) {
	address := "localhost:" + strconv.Itoa(port)
	http.ListenAndServe(address, nil)
}
