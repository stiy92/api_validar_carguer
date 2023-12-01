import { Router, Request, Response } from "express";
import axios from "axios";

const urlwb = require('../class/direction');

const crypto = require('crypto');

// para usar variabel de entorno
//require('dotenv').config();

// datos para realizar la peticion json
const Turnos_AprochesRoutes = Router();

// url ruta donde se encuentra el servicio web lo pondre en la variable de entorno
// const url= process.env.TZ;
const url =  urlwb;

// Función para generar un hash de una cadena usando el algoritmo md5 por que ccarga usa este pero se recomienda SHA256 ya que son mas caracteres
function generarHashMD5(cadena:any) {
    const hash = crypto.createHash('md5');
    hash.update(cadena);
    return hash.digest('hex');
}

// inicio de proceso para el login de res a web
Turnos_AprochesRoutes.post('/turn_aproches',  async (req: Request, res: Response) =>{
   
    try{

    const { Codigo, Clave, Bodega } = req.body; // estos datos vienen en la solicitud
    
    // Generar el hash de la contraseña
    const hashedClave = generarHashMD5(Clave);

    // body de la peticion hacia el soap
    const xmlBody =`<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
    <Cargar_Turnos_Aproche xmlns="http://tempuri.org/">
        <Usuario>${Codigo}</Usuario>
        <Clave>${hashedClave}</Clave>
        <Bodega>${Bodega}</Bodega>
        </Cargar_Turnos_Aproche>
        </soap:Body>
      </soap:Envelope>`;
     
   
        const respuest = await axios.post(url, xmlBody, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                SOAPAction: 'http://tempuri.org/Cargar_Turnos_Aproche',
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
  } catch (error:any) {
    res.status(500).json({
        ok: false,
        mensaje: 'Error al procesar la solicitud',
        error: error.message,
    });
    
}

});

export default Turnos_AprochesRoutes;