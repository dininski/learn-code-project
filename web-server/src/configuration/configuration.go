package configuration

import (
	"encoding/json"
	"io/ioutil"
	"path/filepath"
)

type Config struct {
	Port          int
	StaticFileDir string
}

type Configuration interface {
}

func GetConfiguration() Config {
	var configuration = getConfigInternal()
	return configuration
}

func getConfigInternal() (readyConfig Config) {
	path, _ := filepath.Abs("./config.json")
	content, err := ioutil.ReadFile(path)
	if err != nil {
		panic(err)
	}

	var conf Config
	err = json.Unmarshal(content, &conf)

	if err != nil {
		panic("Error unmarshalling config file")
	}

	return conf
}
