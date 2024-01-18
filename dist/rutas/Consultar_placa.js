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
const ethDB = require("../serviciosdb/asignar_turno_DB");
//inicializao esta dependencia para utilizar las variables de entorno
require('dotenv').config();
// inicializo la variable de entorno
const urlwb1 = process.env.WebUrl;
//aqui paso esa variable con la dependencia de que utilizara axio para las peticiones soap
const urlwb = `${urlwb1}?wsdl`;
const crypto = require('crypto');
//empiezo a utilizar la dependencia para parsear xml a json
// configuracion para parsear el xml a json
const xmlparser = new xml2js_1.Parser({ explicitArray: false, ignoreAttrs: true });
// datos para realizar la peticion json
const PlacasRoutes = (0, express_1.Router)();
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
PlacasRoutes.post('/placa', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Codigo, Clave, Placa, Tipo } = req.body; // estos datos vienen en la solicitud
    try {
        // Generar el hash de la contraseña
        const hashedClave = generarHashMD5(Clave);
        // body de la peticion hacia el soap
        const xmlBody = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
    <Consultar_Placa xmlns="http://tempuri.org/">
        <Usuario>${Codigo}</Usuario>
        <Clave>${hashedClave}</Clave>
        <Placa>${Placa}</Placa>
       </Consultar_Placa>
       </soap:Body>
     </soap:Envelope>`;
        const respuest = yield axios_1.default.post(url, xmlBody, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                SOAPAction: 'http://tempuri.org/Consultar_Placa',
            },
        });
        //varalbe de tipo arreglo para agregar los datos como los quiero en mi interface map
        let placa = [];
        // Verificar si la respuesta contiene la información esperada
        xmlparser.parseString(respuest.data, (err, result) => {
            if (err) {
                throw new Error('Error al parsear la respuesta XML');
            }
            //esta es la esctructura de cada valor en el xml hasta llegar a los campos que se necesitan
            const Consultar_PlacaResult = result['soap:Envelope']['soap:Body']['Consultar_PlacaResponse']['Consultar_PlacaResult'];
            if (Array.isArray(Consultar_PlacaResult)) {
                // Si hay múltiples elementos, iterar sobre ellos
                Consultar_PlacaResult.forEach((info) => {
                    const Cedula = info.Cedula;
                    const Nombre_Conductor = info.Nombre_Conductor;
                    const Orden = info.Orden;
                    const Valido = info.Valido;
                    const Placa = info.Placa;
                    const Transportadora = info.Transportadora;
                    const Concepto = info.Concepto;
                    const Articulo = info.Articulo;
                    const Arribo_Motonave = info.Arribo_Motonave;
                    const Bodega = info.Bodega;
                    const Bodega_Tipo = info.Bodega_Tipo;
                    const Bodega_Propia = info.Bodega_Propia;
                    const Modalidad = info.Modalidad;
                    const Empaque = info.Empaque;
                    const Nombre_Motonave = info.Nombre_Motonave;
                    const Deposito = info.Deposito;
                    const Nombre_Articulo = info.Nombre_Articulo;
                    const Configuracion_Vehicular = info.Configuracion_Vehicular;
                    const Observaciones = info.Observaciones;
                    const Fecha_Entrada = info.Fecha_Entrada;
                    const Unidades = info.Unidades;
                    const Escotilla = info.Escotilla;
                    const Tara = info.Tara;
                    const Peso_a_Cargar = info.Peso_a_Cargar;
                    const Peso_a_Cambiar = info.Peso_a_Cambiar;
                    const Peso_Maximo = info.Peso_Maximo;
                    const Saldo_al_BL = info.Saldo_al_BL;
                    const Saldo_Solicitud = info.Saldo_Solicitud;
                    const De_Compartido = info.De_Compartido;
                    const Urbano_Directo_Controlado = info.Urbano_Directo_Controlado;
                    const Documentacion_Validada = info.Documentacion_Validada;
                    const Deposito_Urbano = info.Deposito_Urbano;
                    // Crear un objeto de tipo placa y agregarlo al arreglo 'placa'
                    placa.push({
                        Cedula: Cedula,
                        Nombre_Conductor: Nombre_Conductor,
                        Orden: Orden,
                        Valido: Valido,
                        Placa: Placa,
                        Transportadora: Transportadora,
                        Concepto: Concepto,
                        Articulo: Articulo,
                        Arribo_Motonave: Arribo_Motonave,
                        Bodega: Bodega,
                        Bodega_Tipo: Bodega_Tipo,
                        Bodega_Propia: Bodega_Propia,
                        Modalidad: Modalidad,
                        Empaque: Empaque,
                        Nombre_Motonave: Nombre_Motonave,
                        Deposito: Deposito,
                        Nombre_Articulo: Nombre_Articulo,
                        Configuracion_Vehicular: Configuracion_Vehicular,
                        Observaciones: Observaciones,
                        Fecha_Entrada: Fecha_Entrada,
                        Unidades: Unidades,
                        Escotilla: Escotilla,
                        Tara: Tara,
                        Peso_a_Cargar: Peso_a_Cargar,
                        Peso_a_Cambiar: Peso_a_Cambiar,
                        Peso_Maximo: Peso_Maximo,
                        Saldo_al_BL: Saldo_al_BL,
                        Saldo_Solicitud: Saldo_Solicitud,
                        De_Compartido: De_Compartido,
                        Urbano_Directo_Controlado: Urbano_Directo_Controlado,
                        Documentacion_Validada: Documentacion_Validada,
                        Deposito_Urbano: Deposito_Urbano
                    });
                });
            }
            else if (Consultar_PlacaResult) {
                // Si es un solo elemento, tratarlo como un arreglo de un solo elemento
                const Cedula = Consultar_PlacaResult.Cedula;
                const Nombre_Conductor = Consultar_PlacaResult.Nombre_Conductor;
                const Orden = Consultar_PlacaResult.Orden;
                const Valido = Consultar_PlacaResult.Valido;
                const Placa = Consultar_PlacaResult.Placa;
                const Transportadora = Consultar_PlacaResult.Transportadora;
                const Concepto = Consultar_PlacaResult.Concepto;
                const Articulo = Consultar_PlacaResult.Articulo;
                const Arribo_Motonave = Consultar_PlacaResult.Arribo_Motonave;
                const Bodega = Consultar_PlacaResult.Bodega;
                const Bodega_Tipo = Consultar_PlacaResult.Bodega_Tipo;
                const Bodega_Propia = Consultar_PlacaResult.Bodega_Propia;
                const Modalidad = Consultar_PlacaResult.Modalidad;
                const Empaque = Consultar_PlacaResult.Empaque;
                const Nombre_Motonave = Consultar_PlacaResult.Nombre_Motonave;
                const Deposito = Consultar_PlacaResult.Deposito;
                const Nombre_Articulo = Consultar_PlacaResult.Nombre_Articulo;
                const Configuracion_Vehicular = Consultar_PlacaResult.Configuracion_Vehicular;
                const Observaciones = Consultar_PlacaResult.Observaciones;
                const Fecha_Entrada = Consultar_PlacaResult.Fecha_Entrada;
                const Unidades = Consultar_PlacaResult.Unidades;
                const Escotilla = Consultar_PlacaResult.Escotilla;
                const Tara = Consultar_PlacaResult.Tara;
                const Peso_a_Cargar = Consultar_PlacaResult.Peso_a_Cargar;
                const Peso_a_Cambiar = Consultar_PlacaResult.Peso_a_Cambiar;
                const Peso_Maximo = Consultar_PlacaResult.Peso_Maximo;
                const Saldo_al_BL = Consultar_PlacaResult.Saldo_al_BL;
                const Saldo_Solicitud = Consultar_PlacaResult.Saldo_Solicitud;
                const De_Compartido = Consultar_PlacaResult.De_Compartido;
                const Urbano_Directo_Controlado = Consultar_PlacaResult.Urbano_Directo_Controlado;
                const Documentacion_Validada = Consultar_PlacaResult.Documentacion_Validada;
                const Deposito_Urbano = Consultar_PlacaResult.Deposito_Urbano;
                placa.push({
                    Cedula: Cedula, Nombre_Conductor: Nombre_Conductor,
                    Orden: Orden,
                    Valido: Valido,
                    Placa: Placa,
                    Transportadora: Transportadora,
                    Concepto: Concepto,
                    Articulo: Articulo,
                    Arribo_Motonave: Arribo_Motonave,
                    Bodega: Bodega,
                    Bodega_Tipo: Bodega_Tipo,
                    Bodega_Propia: Bodega_Propia,
                    Modalidad: Modalidad,
                    Empaque: Empaque,
                    Nombre_Motonave: Nombre_Motonave,
                    Deposito: Deposito,
                    Nombre_Articulo: Nombre_Articulo,
                    Configuracion_Vehicular: Configuracion_Vehicular,
                    Observaciones: Observaciones,
                    Fecha_Entrada: Fecha_Entrada,
                    Unidades: Unidades,
                    Escotilla: Escotilla,
                    Tara: Tara,
                    Peso_a_Cargar: Peso_a_Cargar,
                    Peso_a_Cambiar: Peso_a_Cambiar,
                    Peso_Maximo: Peso_Maximo,
                    Saldo_al_BL: Saldo_al_BL,
                    Saldo_Solicitud: Saldo_Solicitud,
                    De_Compartido: De_Compartido,
                    Urbano_Directo_Controlado: Urbano_Directo_Controlado,
                    Documentacion_Validada: Documentacion_Validada,
                    Deposito_Urbano: Deposito_Urbano,
                });
            }
        });
        if (respuest.data) {
            const Turno = {
                Placa: Placa,
                Codigo: Tipo,
                Producto: placa[0].Nombre_Articulo
            };
            //validar si tiene turno la placa
            const Estadoturno = yield ethDB.verificarEstadoEnturnado(Turno);
            //fin validar placa
            // Aquí puedes manejar la respuesta
            if (Estadoturno !== null && Estadoturno !== undefined) {
                if (Estadoturno == true) {
                    //tiene turno
                    res.status(200).json({
                        ok: false,
                        mensaje: 'Esta placa ya tiene un turno asignado:',
                        placa
                    });
                }
                else {
                    //no tiene turno
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Esta placa no tiene asignado un turno:',
                        placa
                    });
                }
            }
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
exports.default = PlacasRoutes;
