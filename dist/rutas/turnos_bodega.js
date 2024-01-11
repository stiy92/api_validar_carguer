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
const xml2js_1 = require("xml2js");
const urlwb = require('../class/direction');
const crypto = require('crypto');
//empiezo a utilizar la dependencia para parsear xml a json
// configuracion para parsear el xml a json
const xmlparser = new xml2js_1.Parser({ explicitArray: false, ignoreAttrs: true });
// para usar variabel de entorno
//require('dotenv').config();
// datos para realizar la peticion json
const Turnos_BodegaRoutes = (0, express_1.Router)();
// url ruta donde se encuentra el servicio web lo pondre en la variable de entorno
// const url= process.env.TZ;
const url = urlwb;
// Función para generar un hash de una cadena usando el algoritmo md5 por que ccarga usa este pero se recomienda SHA256 ya que son mas caracteres
function generarHashMD5(cadena) {
    const hash = crypto.createHash('md5');
    hash.update(cadena);
    return hash.digest('hex');
}
// inicio de proceso para el login de res a web
Turnos_BodegaRoutes.post('/turn_bodega', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Codigo, Clave, Bodega, Motonave, Articulo } = req.body; // estos datos vienen en la solicitud
        // Generar el hash de la contraseña
        const hashedClave = generarHashMD5(Clave);
        // body de la peticion hacia el soap
        const xmlBody = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
    <Cargar_Turnos_Bodega xmlns="http://tempuri.org/">
        <Usuario>${Codigo}</Usuario>
        <Clave>${hashedClave}</Clave>
        <Bodega>${Bodega}</Bodega>
      <Arribo_Motonave>${Motonave}</Arribo_Motonave>
      <Articulo>${Articulo}</Articulo>
        </Cargar_Turnos_Bodega>
       </soap:Body>
          </soap:Envelope>`;
        const respuest = yield axios_1.default.post(url, xmlBody, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                SOAPAction: 'http://tempuri.org/Cargar_Turnos_Bodega',
            },
        });
        //varalbe de tipo arreglo para agregar los datos como los quiero en mi interface map
        let Turn_bodegas = [];
        // Verificar si la respuesta contiene la información esperada
        xmlparser.parseString(respuest.data, (err, result) => {
            if (err) {
                throw new Error('Error al parsear la respuesta XML');
            }
            const Informacion_Movil_Turnos_Aproche = result['soap:Envelope']['soap:Body']['Cargar_Turnos_BodegaResponse']['Cargar_Turnos_BodegaResult']['Informacion_Movil_Turnos_Aproche'];
            if (Array.isArray(Informacion_Movil_Turnos_Aproche)) {
                // Si hay múltiples elementos, iterar sobre ellos
                Informacion_Movil_Turnos_Aproche.forEach((info) => {
                    const placa = info.Placa;
                    const cedula = info.Cedula;
                    const conductor = info.Conductor;
                    const orden = info.Orden;
                    const nombre_motonave = info.Nombre_Motonave;
                    const fecha = info.Fecha;
                    const articulo = info.Articulo;
                    // Crear un objeto de tipo turn_Bodega y agregarlo al arreglo 'Turn_bodegas'
                    Turn_bodegas.push({ Placa: placa, Cedula: cedula, Conductor: conductor, Orden: orden, Nombre_Motonave: nombre_motonave, Fecha: fecha, Articulo: articulo });
                });
            }
            else if (Informacion_Movil_Turnos_Aproche) {
                // Si es un solo elemento, tratarlo como un arreglo de un solo elemento
                const placa = Informacion_Movil_Turnos_Aproche.Placa;
                const cedula = Informacion_Movil_Turnos_Aproche.Cedula;
                const conductor = Informacion_Movil_Turnos_Aproche.Conductor;
                const orden = Informacion_Movil_Turnos_Aproche.Orden;
                const nombre_motonave = Informacion_Movil_Turnos_Aproche.Nombre_Motonave;
                const fecha = Informacion_Movil_Turnos_Aproche.Fecha;
                const articulo = Informacion_Movil_Turnos_Aproche.Articulo;
                Turn_bodegas.push({ Placa: placa, Cedula: cedula, Conductor: conductor, Orden: orden, Nombre_Motonave: nombre_motonave, Fecha: fecha, Articulo: articulo });
            }
        });
        if (respuest.data) {
            // Aquí puedes manejar la respuesta de la solicitud SOAP
            res.status(200).json({
                ok: true,
                mensaje: 'Se logro conectar al servicio y esta es la respuesta:',
                // respuestaSOAP: respuest.data, 
                Turn_bodegas,
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
exports.default = Turnos_BodegaRoutes;
