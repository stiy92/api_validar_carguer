import { Router, Request, Response } from "express";

const ethDB = require("../serviciosdb/cargar_turnos_DB");

const Cargar_turnos_Routes = Router();

// inicio de proceso para asignar_turno de res a web
Cargar_turnos_Routes.post('/Cargar_turnos',  async (req: Request, res: Response) =>{

       const Turno  = req.body; // estos datos vienen en la solicitud


        //validando el estado de turno cargado o enturnado
        try{
            const Traerturnos= await ethDB.verturno(Turno);
            // Verifica si hay algún resultado
        if (Traerturnos.recordset && Traerturnos.recordset.length > 0) {
            const turnos = Traerturnos.recordset; // Usa solo el conjunto de resultados principal

            res.status(200).json({
                ok: true,
                mensaje: 'Turnos:',
                Traerturnos: {
                    recordset: turnos,
                    rowsAffected: Traerturnos.rowsAffected,
                },
            });

        } else {
            res.status(404).json({
                ok: false,
                mensaje: 'No se encontraron turnos.',
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

    export default Cargar_turnos_Routes;