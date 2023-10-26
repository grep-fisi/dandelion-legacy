package main

import (
	"grap/src/renderer/src/search/db"
	"grap/src/renderer/src/search/handlers"
	"log"
	"net/http"
	// test data package
)

func main() {
	const port string = "9090"

	//dd := &db.DB{}
	//dd.Fill(test_db.DB)

	db.StartDb()

	http.HandleFunc("/", handlers.GeneralHandle)
	http.HandleFunc("/media/", handlers.StaticServe)
	http.HandleFunc("/api/", handlers.QueryPost)
	http.HandleFunc("/upload/", handlers.UploadData)

	log.Println("Opening server @" + port)
	serverErr := http.ListenAndServe(":"+port, nil)
	if serverErr != nil {
		log.Println(serverErr)
	}
}
