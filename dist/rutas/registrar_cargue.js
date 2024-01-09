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
// configuracion para parsear el xml a json
const xmlparser = new xml2js_1.Parser({ explicitArray: false, ignoreAttrs: true });
// datos para realizar la peticion json
const Registrar_Cargue_Routes = (0, express_1.Router)();
// url ruta donde se encuentra el servicio web lo pondre en la variable de entorno
const url = urlwb;
// Función para generar un hash de una cadena usando el algoritmo md5 por que ccarga usa este pero se recomienda SHA256 ya que son mas caracteres
function generarHashMD5(cadena) {
    const hash = crypto.createHash('md5');
    hash.update(cadena);
    return hash.digest('hex');
}
// inicio de proceso para el login de res a web
Registrar_Cargue_Routes.post('/Registrar_cargue', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Codigo, Clave, Placa, Concepto, Bodega, Modalidad, Empaque, Unidades, Escotilla, Configuracion_Vehicular, Configuracion_Peso_Cambiado, Compartido, Bodega_Compartido, Concepto_Compartido, Peso_a_Cambiar, Bodega_Resgistro, es_Urbano_Directo_Controlado, Validar_Documentos } = req.body; // estos datos vienen en la solicitud
        // Generar el hash de la contraseña
        const hashedClave = generarHashMD5(Clave);
        // body de la peticion hacia el soap
        const xmlBody = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
    <Registrar_Cargue xmlns="http://tempuri.org/">
        <Usuario>${Codigo}</Usuario>
        <Clave>${hashedClave}</Clave>
        <Placa>${Placa}</Placa>
        <Concepto>${Concepto}</Concepto>
        <Bodega>${Bodega}</Bodega>
        <Modalidad>${Modalidad}</Modalidad>
        <Empaque>${Empaque}</Empaque>
        <Unidades>${Unidades}</Unidades>
        <Escotilla>${Escotilla}</Escotilla>
        <Configuracion_Vehicular>${Configuracion_Vehicular}</Configuracion_Vehicular>
        <Confirmacion_Peso_Cambiado>${Configuracion_Peso_Cambiado}</Confirmacion_Peso_Cambiado>
        <Compartido>${Compartido}</Compartido>
        <Bodega_Compartido>${Bodega_Compartido}</Bodega_Compartido>
        <Concepto_Compartido>${Concepto_Compartido}</Concepto_Compartido>
        <Peso_a_Cambiar>${Peso_a_Cambiar}</Peso_a_Cambiar>
        <Bodega_Registro>${Bodega_Resgistro}</Bodega_Registro>
        <es_Urbano_Directo_Controlado>${es_Urbano_Directo_Controlado}</es_Urbano_Directo_Controlado>
        <Validar_Documentos>${Validar_Documentos}</Validar_Documentos>

        </Registrar_Cargue>
       </soap:Body>
     </soap:Envelope>`;
        const respuest = yield axios_1.default.post(url, xmlBody, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                SOAPAction: 'http://tempuri.org/Asignar_Turno_Vehiculo',
            },
        });
        //varalbe de tipo arreglo para agregar los datos como los quiero en mi interface map
        let R_turno = [];
        // Verificar si la respuesta contiene la información esperada
        xmlparser.parseString(respuest.data, (err, result) => {
            if (err) {
                throw new Error('Error al parsear la respuesta XML');
            }
            //esta es la esctructura de cada valor en el xml hasta llegar a los campos que se necesitan
            const Registrar_CargueResult = result['soap:Envelope']['soap:Body']['Registrar_CargueResponse']['Registrar_CargueResult'];
            if (Array.isArray(Registrar_CargueResult)) {
                // Si hay múltiples elementos, iterar sobre ellos
                Registrar_CargueResult.forEach((info) => {
                    const Correcto = info.Correcto;
                    const Mensaje = info.Mensaje;
                    // Crear un objeto de tipo placa y agregarlo al arreglo 'placa'
                    R_turno.push({
                        Correcto: Correcto,
                        Mensaje: Mensaje,
                    });
                });
            }
            else if (Registrar_CargueResult) {
                // Si es un solo elemento, tratarlo como un arreglo de un solo elemento
                const Correcto = Registrar_CargueResult.Correcto;
                const Mensaje = Registrar_CargueResult.Mensaje;
                R_turno.push({
                    Correcto: Correcto,
                    Mensaje: Mensaje
                });
            }
        });
        if (respuest.data) {
            // Aquí puedes manejar la respuesta de la solicitud SOAP
            res.status(200).json({
                ok: true,
                mensaje: 'Se logro conectar al servicio y esta es la respuesta:',
                // respuestaSOAP: respuest.data, 
                R_turno,
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
exports.default = Registrar_Cargue_Routes;
