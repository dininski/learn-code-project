package configuration

type Config struct {
}

type Configuration interface {
}

func getConfiguration(cfg *Config) Config {
	return Config{}
}
