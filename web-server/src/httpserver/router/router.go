package router

import (
	"data/uow"
	"fmt"
)

func Print() {
	unitOfWork := uow.GetUoW()
	user := unitOfWork.Users.GetUser()
	fmt.Println(user.Username)
}
