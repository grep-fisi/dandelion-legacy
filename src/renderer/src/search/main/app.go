package main

import (
	"grap/src/renderer/src/search/db"
	"grap/src/renderer/src/search/server"
	"log"
	"net/http"
	// test data package
)

func main() {
	const port string = "9090"

	//dd := &db.DB{}
	//dd.Fill(test_db.DB)

	db.StartDb()

	http.HandleFunc("/", server.GeneralHandle)
	http.HandleFunc("/media/", server.StaticServe)
	http.HandleFunc("/api/", server.QueryPost)
	http.HandleFunc("/upload/", server.UploadData)

	log.Println("Opening server @" + port)
	serverErr := http.ListenAndServe(":"+port, nil)
	if serverErr != nil {
		log.Println(serverErr)
	}
}
