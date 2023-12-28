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
const BodegasRoutes = (0, express_1.Router)();
// url ruta donde se encuentra el servicio web lo pondre en la variable de entorno
// const url= process.env.TZ;
const url = urlwb;
//este campo se debe de cambiar ya que el fornterd debe de enviar la clave encriptada despues de haber iniciado section
// Función para generar un hash de una cadena usando el algoritmo md5 por que ccarga usa este pero se recomienda SHA256 ya que son mas caracteres
function generarHashMD5(cadena) {
    const hash = crypto.createHash('md5');
    hash.update(cadena);
    return hash.digest('hex');
}
// inicio de proceso para el login de res a web
BodegasRoutes.post('/bodegas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Codigo, Clave, Tipo } = req.body; // estos datos vienen en la solicitud
        // Generar el hash de la contraseña
        const hashedClave = generarHashMD5(Clave);
        // body de la peticion hacia el soap
        const xmlBody = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
    <Cargar_Bodegas xmlns="http://tempuri.org/">
        <Usuario>${Codigo}</Usuario>
        <Clave>${hashedClave}</Clave>
        <Tipo>${Tipo}</Tipo>
      <Propia>true</Propia>
        </Cargar_Bodegas>
        </soap:Body>
      </soap:Envelope>`;
        const respuest = yield axios_1.default.post(url, xmlBody, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                SOAPAction: 'http://tempuri.org/Cargar_Bodegas',
            },
        });
        //varalbe de tipo arreglo para agregar los datos como los quiero en mi interface map
        let bodegas = [];
        // Verificar si la respuesta contiene la información esperada
        xmlparser.parseString(respuest.data, (err, result) => {
            if (err) {
                throw new Error('Error al parsear la respuesta XML');
            }
            //esta es la esctructura de cada valor en el xml hasta llegar a los campos que se necesitan
            const informacionMovilGeneral = result['soap:Envelope']['soap:Body']['Cargar_BodegasResponse']['Cargar_BodegasResult']['Informacion_Movil_General'];
            if (Array.isArray(informacionMovilGeneral)) {
                // Si hay múltiples elementos, iterar sobre ellos
                informacionMovilGeneral.forEach((info) => {
                    const codigo = info.Codigo;
                    const descripcion = info.Descripcion;
                    // Crear un objeto de tipo Bodega y agregarlo al arreglo 'bodegas'
                    bodegas.push({ Codigo: codigo, Descripcion: descripcion });
                });
            }
            else if (informacionMovilGeneral) {
                // Si es un solo elemento, tratarlo como un arreglo de un solo elemento
                const codigo = informacionMovilGeneral.Codigo;
                const descripcion = informacionMovilGeneral.Descripcion;
                bodegas.push({ Codigo: codigo, Descripcion: descripcion });
            }
        });
        if (respuest.data) {
            // Aquí puedes manejar la respuesta de la solicitud SOAP
            res.status(200).json({
                ok: true,
                mensaje: 'Se logro conectar al servicio y esta es la respuesta:',
                // respuestaSOAP: respuest.data, 
                bodegas,
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
exports.default = BodegasRoutes;
