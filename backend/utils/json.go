package utils

import (
	"encoding/json"
	"fmt"
)

func Stringify(data map[string]interface{}) string {
	final := removeNils(data)
	out, err := json.Marshal(final)
	if err != nil {
		return ""
	}
	return string(out)
}

func removeNils(initialMap map[string]interface{}) map[string]interface{} {
	withoutNils := map[string]interface{}{}
	for key, value := range initialMap {
		_, ok := value.(map[string]interface{})
		if ok {
			value = removeNils(value.(map[string]interface{}))
			withoutNils[key] = value
			continue
		}
		if value != nil {
			withoutNils[key] = value
		}
	}
	return withoutNils
}

func Parse(in string, result any) error {
	if err := json.Unmarshal([]byte(in), result); err != nil {
		fmt.Printf("Request error: %s\n", err)
		return err
	}

	return nil
}
