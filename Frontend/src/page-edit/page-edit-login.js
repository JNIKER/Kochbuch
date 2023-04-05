"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-edit-login.html";

/**
 * Klasse PageEdit: Stellt die Seite zum Anlegen oder Bearbeiten eines Benutzers
 * zur Verfügung.
 */
export default class PageEdit extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     * @param {Integer} editId ID des bearbeiteten Datensatzes
     */
    constructor(app, editId) {
        super(app, HtmlTemplate);

        // Bearbeiteter Datensatz
        this._editId = editId;

        this._dataset = {
            username: "",
            email: "",
            password: "",
        };

        // Eingabefelder
        this._usernameInput = null;
        this._passwordInput  = null;
        this._passwordInput     = null;  
    }

    /**
     * HTML-Inhalt und anzuzeigende Daten laden.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();

        // Bearbeiteten Datensatz laden
        if (this._editId) {
            this._url = `/login/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.username}`;
        } else {
            this._url = `/login`;
            this._title = "Benutzer hinzufügen";
        }

        let html = this._mainElement.innerHTML;
        html = html.replace("$USERNAME$", this._dataset.username);
        html = html.replace("$EMAIL$", this._dataset.email);
        html = html.replace("$PASSWORD$", this._dataset.password);
        this._mainElement.innerHTML = html;

        // Event Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());
        
        this._usernameInput  = this._mainElement.querySelector("input.username");
        this._emailInput     = this._mainElement.querySelector("input.email");
        this._passwordInput     = this._mainElement.querySelector("input.password");
    }

    /**
     * Speichert den aktuell bearbeiteten Datensatz und kehrt dann wieder
     * in die Listenübersicht zurück.
     */
    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset._id        = this._editId;
        this._dataset.username  = this._usernameInput.value.trim();
        this._dataset.email      = this._emailInput.value.trim();
        this._dataset.password      = this._passwordInput.value.trim();
        
        // benötigte Eingaben zum Speichern eines neuen Benutzers
        if (!this._dataset.username) {
            alert("Geben Sie erst einen Usernamen ein.");
            return;
        }

        if (!this._dataset.password) {
            alert("Geben Sie erst einen Passwort ein.");
            return;
        }

        // Datensatz speichern
        try {
            if (this._editId) {
                await this._app.backend.fetch("PUT", this._url, {body: this._dataset});
            } else {
                await this._app.backend.fetch("POST", this._url, {body: this._dataset});
            }
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/list-user";
    }
};
