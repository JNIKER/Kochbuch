"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Adressen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Adressen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class RecipeService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._Recipe = DatabaseFactory.database.collection("recipes");
    }

    /**
     * Rezepte suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Adressen
     */
    async search(query) {
        let cursor = this._Recipe.find(query, {
            sort: {
                name: 1,
                difficulty: 1,
                time: 1,
                serves: 1,
                category: 1,
                ingredients: 1,
                description: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Rezeptes.
     *
     * @param {Object} Recipe Zu speichernde Rezeptdaten
     * @return {Promise} Gespeicherte Rezeptdaten
     */
    async create(Recipe) {
        Recipe = Recipe || {};

        let newRecipe = {
            name: Recipe.name || "",
            difficulty: Recipe.difficulty  || "",
            time: Recipe.time      || "",
            serves: Recipe.serves      || "",
            category: Recipe.category      || "",
            ingredients: Recipe.ingredients      || "",
            description: Recipe.description      || "",
        };

        let result = await this._Recipe.insertOne(newRecipe);
        return await this._Recipe.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Gefundene Adressdaten
     */
    async read(id) {
        let result = await this._Recipe.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Adresse, durch Überschreiben einzelner Felder
     * oder des gesamten Adressobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Adresse
     * @param {[type]} Recipe Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten oder undefined
     */
    async update(id, Recipe) {
        let oldRecipe = await this._Recipe.findOne({_id: new ObjectId(id)});
        if (!oldRecipe) return;

        let updateDoc = {
            $set: {},
        }

        if (Recipe.name)        updateDoc.$set.name = Recipe.name;
        if (Recipe.difficulty)  updateDoc.$set.difficulty = Recipe.difficulty;
        if (Recipe.time)        updateDoc.$set.time = Recipe.time;
        if (Recipe.serves)      updateDoc.$set.serves = Recipe.serves;
        if (Recipe.category)    updateDoc.$set.category = Recipe.category;
        if (Recipe.ingredients) updateDoc.$set.ingredients = Recipe.ingredients;
        if (Recipe.description) updateDoc.$set.description = Recipe.description;


        await this._Recipe.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._Recipe.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._Recipe.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
