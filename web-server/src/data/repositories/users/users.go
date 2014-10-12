package usersrepo

import (
	"data/models/user"
	"fmt"
)

type UsersRepository struct {
}

func (u *UsersRepository) RegisterUser(user user.User) {
	fmt.Println(user.Username)
}

func (u *UsersRepository) GetUser() user.User {
	user := user.NewUser()
	user.Username = "Someone"
	return user
}
