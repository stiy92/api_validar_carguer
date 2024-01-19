import { Router, Request, Response } from "express";

const ethDB = require("../serviciosdb/cargar_sitios_DB");

const Cargar_sitios_Routes = Router();

// inicio de proceso para asignar_turno de res a web
Cargar_sitios_Routes.post('/Cargar_sitios',  async (req: Request, res: Response) =>{

   // const Sitio  = req.body; // estos datos vienen en la solicitud


        //validando el estado de turno cargado o enturnado
        try{
            const Traersitios= await ethDB.versitios();
            // Verifica si hay algún resultado
        if (Traersitios.recordset && Traersitios.recordset.length > 0) {
            const sitios = Traersitios.recordset; // Usa solo el conjunto de resultados principal

            res.status(200).json({
                ok: true,
                mensaje: 'Sitios:',
                Traersitios: {
                    recordset: sitios,
                    rowsAffected: Traersitios.rowsAffected,
                },
            });
        } else {
            res.status(404).json({
                ok: false,
                mensaje: 'No se encontraron sitios.',
            });
        }
    } catch (error: any) {
        console.error('Error al procesar la solicitud:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al procesar la solicitud',
            error: error.message,
        });
    }
});

    export default Cargar_sitios_Routes;