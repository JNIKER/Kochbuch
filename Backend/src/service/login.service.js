"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Benutzern. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Benutzern werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class LoginService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._login = DatabaseFactory.database.collection("user");
    }

    /**
     * Benutzer suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Benutzern
     */
    async search(query) {
        let cursor = this._login.find(query, {
            sort: {
                username: 1,
                email: 1,
                password: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Benutzers.
     *
     * @param {Object} login Zu speichernde Benutzerdaten
     * @return {Promise} Gespeicherte Benutzerdaten
     */
    async create(login) {
        login = login || {};

        let newlogin = {
            username: login.username || "",
            email: login.email  || "",
            password: login.password      || "",
        };

        let result = await this._login.insertOne(newlogin);
        return await this._login.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen eines vorhandenen Benutzers anhand seiner ID.
     *
     * @param {String} id ID der gesuchten Benutzer
     * @return {Promise} Gefundene Benutzerdaten
     */
    async read(id) {
        let result = await this._login.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Benutzer, durch Überschreiben einzelner Felder
     * oder des gesamten Benutzerobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Benutzer
     * @param {[type]} login Zu speichernde Benutzerdaten
     * @return {Promise} Gespeicherte Benutzerdaten oder undefined
     */
    async update(id, login) {
        let oldlogin = await this._login.findOne({_id: new ObjectId(id)});
        if (!oldlogin) return;

        let updateDoc = {
            $set: {},
        }

        if (login.username) updateDoc.$set.username = login.username;
        if (login.email)  updateDoc.$set.email  = login.email;
        if (login.password)      updateDoc.$set.password      = login.password;

        await this._login.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._login.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Benutzer anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Benutzer
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._login.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
