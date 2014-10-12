package user

type User struct {
	Id       string
	Username string
	Password string
	Email    string
}

func NewUser() User {
	return User{}
}
