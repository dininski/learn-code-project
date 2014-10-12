package uow

import (
	"data/repositories/users"
)

type UnitOfWork struct {
	Users usersrepo.UsersRepository
}

func GetUoW() UnitOfWork {
	usersRepo := usersrepo.UsersRepository{}
	return UnitOfWork{
		Users: usersRepo,
	}
}

// func (u *UnitOfWork) Users() (usersRepo UsersRepository) {
// 	usersRepo := new(usersrepo.UsersRepository)
// 	return usersRepo
// }
