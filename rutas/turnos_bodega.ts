import { Router, Request, Response } from "express";
import axios from "axios";
import { Parser } from 'xml2js';
import { Turn_Bodega, Placa } from '../interfaces/interface';

//inicializao esta dependencia para utilizar las variables de entorno
require('dotenv').config();

// inicializo la variable de entorno
const urlwb1 = process.env.WebUrl;

//aqui paso esa variable con la dependencia de que utilizara axio para las peticiones soap
const urlwb = `${urlwb1}?wsdl`;

const crypto = require('crypto');

//empiezo a utilizar la dependencia para parsear xml a json
// configuracion para parsear el xml a json
const xmlparser = new Parser({ explicitArray: false, ignoreAttrs:true});

// para usar variabel de entorno
//require('dotenv').config();

// datos para realizar la peticion json
const Turnos_BodegaRoutes = Router();

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
Turnos_BodegaRoutes.post('/turn_bodega',  async (req: Request, res: Response) =>{
   
    try{

    const { Codigo, Clave, Bodega, Motonave, Articulo } = req.body; // estos datos vienen en la solicitud
    
    // Generar el hash de la contraseña
    const hashedClave = generarHashMD5(Clave);

    // body de la peticion hacia el soap
    const xmlBody =`<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
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
     
   
        const respuest = await axios.post(url, xmlBody, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                SOAPAction: 'http://tempuri.org/Cargar_Turnos_Bodega',
              },

        });

        //varalbe de tipo arreglo para agregar los datos como los quiero en mi interface map
        let Turn_bodegas: Turn_Bodega[] = [];

         // Verificar si la respuesta contiene la información esperada
         xmlparser.parseString(respuest.data, (err:any, result:any)=>{

            if (err) {
                throw new Error('Error al parsear la respuesta XML');
            }
            const Informacion_Movil_Turnos_Aproche = result['soap:Envelope']['soap:Body']['Cargar_Turnos_BodegaResponse']['Cargar_Turnos_BodegaResult']['Informacion_Movil_Turnos_Aproche'];
            
            if (Array.isArray(Informacion_Movil_Turnos_Aproche)) {
                // Si hay múltiples elementos, iterar sobre ellos
                Informacion_Movil_Turnos_Aproche.forEach((info: any) => {
                    const placa = info.Placa;
                    const cedula = info.Cedula;
                    const conductor = info.Conductor;
                    const orden = info.Orden;
                    const nombre_motonave = info.Nombre_Motonave;
                    const fecha = info.Fecha;
                    const articulo = info.Articulo;

                    // Crear un objeto de tipo turn_Bodega y agregarlo al arreglo 'Turn_bodegas'
                    Turn_bodegas.push({ Placa: placa, Cedula: cedula, Conductor: conductor, Orden: orden, Nombre_Motonave: nombre_motonave, Fecha:fecha, Articulo: articulo });
                });
            } else if (Informacion_Movil_Turnos_Aproche) {
                // Si es un solo elemento, tratarlo como un arreglo de un solo elemento
                const placa= Informacion_Movil_Turnos_Aproche.Placa;
                const cedula = Informacion_Movil_Turnos_Aproche.Cedula;
                const conductor = Informacion_Movil_Turnos_Aproche.Conductor;
                const orden = Informacion_Movil_Turnos_Aproche.Orden;
                const nombre_motonave = Informacion_Movil_Turnos_Aproche.Nombre_Motonave;
                const fecha = Informacion_Movil_Turnos_Aproche.Fecha;
                const articulo = Informacion_Movil_Turnos_Aproche.Articulo;

                Turn_bodegas.push({ Placa: placa, Cedula: cedula, Conductor: conductor, Orden: orden, Nombre_Motonave: nombre_motonave, Fecha:fecha, Articulo: articulo });
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
  } catch (error:any) {
    res.status(500).json({
        ok: false,
        mensaje: 'Error al procesar la solicitud',
        error: error.message,
    });
    
}

});

export default Turnos_BodegaRoutes;