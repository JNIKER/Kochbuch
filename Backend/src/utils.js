"use strict";

/**
 * Hilfsfunktion zur Vereinfachung der HTTP-Handler-Methoden in Anlehnung an
 * Vgl. https://stackoverflow.com/a/48109157
 *
 * @param {Function} func Asynchrone Handler-Funktion
 * @return {Function} Synchrone Handler-Funktion mit Callback-Mechanismus
 */
export function wrapHandler(that, func) {
    func = func.bind(that);

    return (req, res, next) => {
        try {
            return func(req, res, next)?.catch((ex) => {
                return next(ex);
            });
        } catch (ex) {
            return next(ex);
        }
    };
};
