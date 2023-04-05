"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Rezepten. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Rezepte werden der Einfachheit halber in einer MongoDB abgelegt.
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
     * @return {Promise} Liste der gefundenen Rezepte
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
     * Auslesen eines vorhandenen Rezeptes anhand ihrer ID.
     *
     * @param {String} id ID des gesuchten Rezeptes
     * @return {Promise} Gefundene Rezeptdaten
     */
    async read(id) {
        let result = await this._Recipe.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Rezeptes, durch Überschreiben einzelner Felder
     * oder des gesamten Rezeptobjekts (ohne die ID).
     *
     * @param {String} id ID des gesuchten Rezeptes
     * @param {[type]} Recipe Zu speichernde Rezeptdaten
     * @return {Promise} Gespeicherte Rezeptdaten oder undefined
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
     * Löschen eines Rezeptes anhand ihrer ID.
     *
     * @param {String} id ID des gesuchten Rezeptes
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._Recipe.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
