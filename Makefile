BIN_NAME=setbase
setbase_data="./src/renderer/src/data/movies.json"

all: clean serve

prepare:
	export setbase_data=${setbase_data}

serve: prepare
	go build -o ${BIN_NAME} ./src/renderer/src/search/cmd/serve
	./${BIN_NAME}

clean:
	go clean
	rm -rf ${BIN_NAME}

