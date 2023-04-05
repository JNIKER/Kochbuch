"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen. Stattdessen kann
 * einfach das Singleton-Objekt dieser Klasse importiert und das Attribut
 * `mongodb` oder `database` ausgelesen werden.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann. Hier wird dann
     * auch gleich die Verbindung hergestellt.
     *
     * @param {String} connectionUrl URL-String mit den Verbindungsdaten
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("app_database");

        await this._createDemoData();
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */
    async _createDemoData() {
        //// TODO: Methode anpassen, um zur eigenen App passende Demodaten anzulegen ////
        //// oder die Methode ggf. einfach löschen und ihren Aufruf oben entfernen.  ////
        let recipes = this.database.collection("recipes");

        if (await recipes.estimatedDocumentCount() === 0) {
            recipes.insertMany([
                
                //Für unser Projekt nach folgender Struktur anpassen
                {
                   name:"Kartoffelsalat",
                   difficulty: "1",
                   time: "2",
                   serves: "3",
                   category: "4",
                   ingredients: "5",
                   description: "6"

                },
                {
                    name:"Gurkensalat",
                    difficulty: "1",
                    time: "2",
                    serves: "3",
                    category: "4",
                    ingredients: "5",
                    description: "6"
 
                 },
            ]);
        }

            let user = this.database.collection("user");

        if (await user.estimatedDocumentCount() === 0) {
            user.insertMany([
                
                //Für unser Projekt nach folgender Struktur anpassen
                {
                   username: "Moritz",
                   email: "moritz@rau.de",
                   password: "Schnitzel123"

                }
            ]);
        }
    }
}

export default new DatabaseFactory();
