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
exports.versitios = void 0;
//requeriendo las dependencias de mssql
const sql = require('mssql');
//requeriendo las crednciales y rutas a la DB
const con = require('../class/direction');
//realizar la consulta de sitios
function versitios() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //crear la instancia de la conexión con ..class/direction
            const pool = yield sql.connect(con);
            //luego realizar la consulta
            const result = yield pool.request().query("select * from sectors ");
            sql.close();
            return result;
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.versitios = versitios;
//fin de ver los turnos
