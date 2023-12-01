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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
// llamando ruta principal de webservices
const urlweb = require('../class/direction');
// componente para encryptar clave
const crypto = require('crypto');
// para usar variabel de entorno
//require('dotenv').config();
// datos para realizar la peticion json
const UserRoutes = (0, express_1.Router)();
// url ruta donde se encuentra el servicio web lo pondre en la variable de entorno
// const url= process.env.TZ;
const url = urlweb;
// Función para generar un hash de una cadena usando el algoritmo md5 por que ccarga usa este pero se recomienda SHA256 ya que son mas caracteres
function generarHashMD5(cadena) {
    const hash = crypto.createHash('md5');
    hash.update(cadena);
    return hash.digest('hex');
}
// inicio de proceso para el login de res a web
UserRoutes.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Codigo, Clave } = req.body; // estos datos vienen en la solicitud
        // Generar el hash de la contraseña
        const hashedClave = generarHashMD5(Clave);
        // body de la peticion hacia el soap
        const xmlBody = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Validar_Usuario xmlns="http://tempuri.org/">
        <Codigo>${Codigo}</Codigo>
        <Clave>${hashedClave}</Clave>
      </Validar_Usuario>
    </soap:Body>
    </soap:Envelope>`;
        const respuest = yield axios_1.default.post(url, xmlBody, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                SOAPAction: 'http://tempuri.org/Validar_Usuario',
            },
        });
        // Verificar si la respuesta contiene la información esperada
        if (respuest.data) {
            // Aquí puedes manejar la respuesta de la solicitud SOAP
            res.status(200).json({
                ok: true,
                mensaje: 'Se logro conectar al servicio y esta es la respuesta:',
                respuestaSOAP: respuest.data, // Puedes devolver la respuesta SOAP si es necesario
            });
        }
        else {
            res.status(500).json({
                ok: false,
                mensaje: 'No se recibió una respuesta válida del servicio SOAP',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al procesar la solicitud',
            error: error.message,
        });
    }
}));
exports.default = UserRoutes;
