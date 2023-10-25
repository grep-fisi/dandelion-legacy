package server

import (
	"encoding/json"
	"grap/src/renderer/src/search/db"
	"log"
	"net/http"
	"strings"
)

var database *db.DB

func EnableEndpoint(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Methods", "ANY")
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Headers", "*")
}

func GeneralHandle(w http.ResponseWriter, r *http.Request) {
	EnableEndpoint(&w)
	if (*r).Method == "OPTIONS" {
		w.Write([]byte("hola " + r.RemoteAddr))
		w.WriteHeader(http.StatusOK)
		return
	} else {
		w.Write([]byte("hola " + r.RemoteAddr))
		return
	}
}

func UploadData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")

    if r.Method == http.MethodOptions {
        w.WriteHeader(http.StatusOK)
    } else if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusInternalServerError)
    }

    newData := &db.DB{}
    decodeErr := json.NewDecoder(r.Body).Decode(&newData)
    if decodeErr != nil {
        w.WriteHeader(http.StatusInternalServerError)
    } else {
        w.WriteHeader(200)
    }

    database.ListedData = newData.ListedData
    log.Println(database)
}

func QueryPost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	EnableEndpoint(&w)

	if (*r).Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var data db.Query
	decoder := json.NewDecoder(r.Body)
	decodeErr := decoder.Decode(&data)
	if decodeErr != nil {
		log.Println(decodeErr)
	}

    log.Println(database)

	var startErr error

	if database == nil {
		database, startErr = db.StartDb()
		if startErr != nil {
			log.Println("db start error: " + startErr.Error())
			w.WriteHeader(http.StatusInternalServerError)
		}
	}

	queryResult, queryErr := database.Query(data)
	if queryErr != nil {
		log.Println("query result error: " + queryErr.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response := new(strings.Builder)
	encodeErr := json.NewEncoder(response).Encode(queryResult)
	if encodeErr != nil {
		log.Println("json encode error: " + encodeErr.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write([]byte(response.String()))
	return
}
