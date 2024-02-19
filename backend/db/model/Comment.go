package model

import "encoding/json"

type Comment struct {
	Base
	UserName      string
	UserID        int64
	SpreadSheetID string
	SheetNo       int64
	CellID        string
	Content       string
}

func (in *Comment) Stringify() string {
	b, err := json.Marshal(in)
	if err != nil {
		return ""
	}
	return string(b)
}

func StringifyComments(in []*Comment) string {
	b, err := json.Marshal(in)
	if err != nil {
		return ""
	}
	return string(b)
}
