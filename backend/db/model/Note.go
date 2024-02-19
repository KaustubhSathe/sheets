package model

import "encoding/json"

type Note struct {
	Base
	UserName      string
	UserID        int64
	SpreadSheetID string
	SheetNo       int64
	CellID        string
	Content       string
}

func (in *Note) Stringify() string {
	b, err := json.Marshal(in)
	if err != nil {
		return ""
	}
	return string(b)
}

func StringifyNotes(in []*Note) string {
	b, err := json.Marshal(in)
	if err != nil {
		return ""
	}
	return string(b)
}
