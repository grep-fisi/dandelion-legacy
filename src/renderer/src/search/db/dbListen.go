package db

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
    "path/filepath"
)

var data []Register
var dataHome string

func registerWalkFunc(path string, info os.DirEntry, err error) error {
    if err != nil {
        return err
    }

    if info.IsDir() || filepath.Ext(info.Name()) != ".META" {
        return nil
    }


    sets := []string{}

    metaFile, openErr := os.OpenFile(path, os.O_RDWR, 00666)
    if openErr != nil {
        return openErr
    }

    reader := bufio.NewReader(metaFile)

    origPath, _, nameErr := reader.ReadLine()
    if nameErr != nil {
        return nameErr
    }

    line, _, err := reader.ReadLine();
    for err != io.EOF {
        sets = append(sets, string(line))
        line, _, err = reader.ReadLine();
    }

    metaFile.Close()

    data = append(data, Register{
        Path: dataHome + "/" + string(origPath),
        Sets: sets,
    })

    return nil
}

// This is the usual setbase data module that
// would be used, not necessary in this case whatsoever
//
//func StartDb() (*DB, error) {
//    dataHome = os.Getenv("setbase_data")
//    traverseErr := filepath.WalkDir(dataHome, registerWalkFunc)
//
//    if traverseErr != nil {
//        return nil, traverseErr
//    }
//
//    newBase := &DB{
//        ListedData: data,
//    }
//
//    return newBase, nil
//}

var Database *DB

func StartDb() (error) {
    dataList := os.Getenv("setbase_data")
    dataFile, openErr := os.Open(dataList)
    if openErr != nil {
        return openErr
    }

    newBase := &DB{
        ListedData: []Register{},
    }

    decodeErr := json.NewDecoder(dataFile).Decode(&newBase.ListedData)
    if decodeErr != nil {
        log.Panicln(decodeErr)
        return decodeErr
    }

    Database = newBase

    fmt.Println(Database)
    return nil
}

