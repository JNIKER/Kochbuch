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
     * Hilfsmethode zum Anlegen von Demodaten.
     */
    async _createDemoData() {

        let recipes = this.database.collection("recipes");

        if (await recipes.estimatedDocumentCount() === 0) {
            recipes.insertMany([
                
                //Demodaten für Rezepte
                {
                   name:"Kartoffelsalat",
                   difficulty: "mittel",
                   time: "20min",
                   serves: "5",
                   category: "vegetarisch",
                   ingredients: "1 kg festkochende Kartoffeln, Salz, 2 Zwiebeln, 3 Gewürzgurken, 150 g Fleischwurst, 4 Eier",
                   description: "Kartoffeln waschen und in Salzwasser ca. 20 Minuten garen. Unter kaltem Wasser abschrecken, pellen und in Würfel schneiden. Zwiebeln schälen und fein hacken. Gewürzgurken und Fleischwurst klein schneiden. Eier hart kochen, pellen und in Scheiben schneiden."

                },
                {
                    name: "Gürkensalat",
                    difficulty: "einfach",
                    time: "15min",
                    serves: "4",
                    category: "vegetarisch",
                    ingredients: "2 Gurken, 1/2 rote Zwiebel, 1 Knoblauchzehe, 2 EL Olivenöl, 2 EL Weißweinessig, 1 TL Zucker, Salz, Pfeffer, Dill",
                    description: "Die Gurken waschen und in Scheiben schneiden. Die rote Zwiebel schälen und in dünne Ringe schneiden. Die Knoblauchzehe schälen und fein hacken. In einer Schüssel das Olivenöl, Weißweinessig, Zucker, Salz und Pfeffer vermengen. Die Gurken, Zwiebelringe und Knoblauchzehe in die Schüssel geben und alles gut vermengen. Mit gehacktem Dill garnieren und servieren."
                    },
            ]);
        }

            let user = this.database.collection("user");

        if (await user.estimatedDocumentCount() === 0) {
            user.insertMany([
                
                //Demodaten für Benutzer
                {
                   username: "Moritz",
                   email: "moritz@rau.de",
                   password: "bitteGönn30Punkte!"

                },
                {
                    username: "Jan- Niklas",
                    email: "jan-niklas@erdmann.de",
                    password: "Bitte!Bitte!Bitte!"
 
                 }
            ]);
        }
    }
}

export default new DatabaseFactory();
