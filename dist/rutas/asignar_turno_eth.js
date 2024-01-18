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
const ethDB = require("../serviciosdb/asignar_turno_DB");
const Asignar_turno_eth_Routes = (0, express_1.Router)();
// inicio de proceso para asignar_turno de res a web
Asignar_turno_eth_Routes.post('/Asignar_turno_eth', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //capturar dia y mes
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1; // Los meses en JavaScript son indexados desde 0, por lo que sumamos 1
    //formato de fecha como lo solicita hestado hechos
    const fecha = new Date(); // Obtener la fecha y hora actuales
    const fechaFormateada = fecha.toISOString().slice(0, 19).replace('T', ' '); // Formatear como "YYYY-MM-DD HH:mm:SS.sss"
    const Turno = req.body; // estos datos vienen en la solicitud
    //ASIGNAR TURNO
    const Numeroturno = yield ethDB.obtenerUltimoTurno(Turno);
    const nuevoturno = Numeroturno.ultimoTurno + 1;
    //IDENTIFICAR ID DE USUARIO
    const ID = yield ethDB.obtenerIduser(Turno);
    const Turno_f = [{
            turno: nuevoturno,
            placa: Turno.Placa,
            sector: Turno.Sector,
            code: Turno.Codigo,
            sector_name: Turno.Sector_name,
            producto: Turno.Producto,
            generated: Turno.Sector === 'M' ? `${Turno.Codigo}-${Turno.Sector_name}-${Turno.Producto}`
                : `${dia}-${mes}-${Turno.Codigo}-${Turno.Sector_name}-${Turno.Producto}`,
            estado: 'enturnado',
            created_at: fechaFormateada,
            updated_at: fechaFormateada,
            id: ID
        }];
    //validando el estado de turno cargado o enturnado
    try {
        const Estadoturno = yield ethDB.verificarEstadoEnturnado(Turno);
        if (Estadoturno !== null && Estadoturno !== undefined) {
            // 
            if (Estadoturno == false) {
                //ingresar los datos
                const Turno_ingresado = yield ethDB.asignarNuevoTurno(Turno_f);
                res.status(Turno_ingresado.success ? 200 : 500).json({
                    Turno_ingresado,
                    nuevoturno
                });
            }
            else {
                res.status(200).json({
                    ok: false,
                    mensaje: 'Esta placa ya tiene un turno asignado:',
                    Numeroturno
                });
            }
        }
        else {
            res.status(500).json({
                ok: false,
                mensaje: 'No se recibió datos del estado de turno',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al procesar la solicitud de turno',
            error: error.message,
        });
    }
}));
exports.default = Asignar_turno_eth_Routes;
