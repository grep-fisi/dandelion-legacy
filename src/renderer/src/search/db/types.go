package db

type Register struct {
    Path string     `json:"name"`
    Sets []string   `json:"tags"`
}

type Query struct {
    Sets []string   `json:"sets"`
    Expr string     `json:"expr"`
}

type DB struct {
    ListedData []Register `json:"files"`
}


