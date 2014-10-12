package main

import (
	"fmt"
	"net/http"
	"router"
)

func main() {
	http.Handle("/string", a)
	http.ListenAndServe("localhost:4000", nil)
}
