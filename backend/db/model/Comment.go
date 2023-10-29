package model

type Comment struct {
	Base
	UserName string
	UserID   int64
	CellID   string
	Content  string
}
