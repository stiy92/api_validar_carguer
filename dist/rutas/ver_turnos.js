"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ethDB = require("../serviciosdb/cargar_turnos_DB");
const Cargar_turnos_Routes = (0, express_1.Router)();
// inicio de proceso para asignar_turno de res a web
Cargar_turnos_Routes.post('/Cargar_turnos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Turno = req.body; // estos datos vienen en la solicitud
    //validando el estado de turno cargado o enturnado
    try {
        const Traerturnos = yield ethDB.verturno(Turno);
        // Verifica si hay algún resultado
        if (Traerturnos.recordset && Traerturnos.recordset.length > 0) {
            const turnos = Traerturnos.recordset; // Usa solo el conjunto de resultados principal
            res.status(200).json({
                ok: true,
                mensaje: 'Turnos:',
                Traerturnos: {
                    recordset: turnos,
                    rowsAffected: Traerturnos.rowsAffected,
                },
            });
        }
        else {
            res.status(404).json({
                ok: false,
                mensaje: 'No se encontraron turnos.',
            });
        }
    }
    catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al procesar la solicitud',
            error: error.message,
        });
    }
}));
exports.default = Cargar_turnos_Routes;
