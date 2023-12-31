package db

import (
	"errors"
	"fmt"
	parser "dandelion/src/renderer/src/search/pkg/logic-parser/ast"
	"dandelion/src/renderer/src/search/pkg/logic-parser/parseUtils"
	"strings"
)

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


func (database *DB) Query(queryObj Query) ([]Register, error) {
	var returnable []Register
	var cleansingErr error

	persistent := make(map[string]rune)

	if len(queryObj.Sets) > len(parser.Variables) {
		return returnable, errors.New(fmt.Sprintf("too many sets (%d), max is %d", len(queryObj.Sets), len(parser.Variables)))
	}

	queryStr := queryObj.Expr
	queryStr, cleansingErr = parseUtils.CleanString(queryStr)
	if cleansingErr != nil {
		return returnable, cleansingErr
	}

	for i, elem := range queryObj.Sets {
		persistent[elem] = parser.Variables[i]
		queryStr = strings.ReplaceAll(queryStr, elem, string(parser.Variables[i]))
	}

	// this is the evaluation tree
	tree, parseErr := parser.Parse(queryStr)
	if parseErr != nil {
		return returnable, parseErr
	}

	for _, reg := range (*database).ListedData {
		individualEvaluators := []rune{}
		for _, elem := range reg.Sets {
			individualEvaluators = append(individualEvaluators, persistent[elem])
		}

		if tree.Eval(individualEvaluators) {
			returnable = append(returnable, reg)
		}
	}

	return returnable, nil
}
