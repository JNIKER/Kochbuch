"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Adressen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Adressen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class LoginService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._logines = DatabaseFactory.database.collection("login");
    }

    /**
     * Adressen suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Adressen
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
     * Speichern einer neuen Adresse.
     *
     * @param {Object} login Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten
     */
    async create(login) {
        login = login || {};

        let newlogin = {
            username: login.username || "",
            email: login.email  || "",
            password: login.password      || "",
        };

        let result = await this._logines.insertOne(newlogin);
        return await this._login.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Gefundene Adressdaten
     */
    async read(id) {
        let result = await this._login.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Adresse, durch Überschreiben einzelner Felder
     * oder des gesamten Adressobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Adresse
     * @param {[type]} login Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten oder undefined
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
     * Löschen einer Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._login.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
