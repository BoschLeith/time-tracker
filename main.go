package main

import (
	"net/http"
	"text/template"
)

func renderTemplate(w http.ResponseWriter, tmpl string, data any) {
	tmpls, err := template.ParseFiles("templates/base.html", tmpl)
	if err != nil {
		http.Error(w, "Could not load template", http.StatusInternalServerError)
		return
	}

	dataMap := map[string]any{
		"Title": data,
	}

	err = tmpls.ExecuteTemplate(w, "base.html", dataMap)
	if err != nil {
		http.Error(w, "Could not execute template", http.StatusInternalServerError)
		return
	}
}

func dashboardHandler(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "templates/dashboard.html", "Dashboard")
}

func main() {
	http.HandleFunc("/", dashboardHandler)

	println("Starting server on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		println("Error starting server:", err)
	}
}
