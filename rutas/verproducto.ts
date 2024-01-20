import { Router, Request, Response } from "express";

const ethDB = require("../serviciosdb/cargar_turnos_DB");

const Cargar_productos_Routes = Router();

// inicio de proceso para asignar_turno de res a web
Cargar_productos_Routes.post('/Cargar_producto',  async (req: Request, res: Response) =>{

       const Turno  = req.body; // estos datos vienen en la solicitud


        //validando el estado de turno cargado o enturnado
        try{
            const Traerproducto= await ethDB.verproducto(Turno);
            // Verifica si hay algún resultado
        if (Traerproducto.recordset && Traerproducto.recordset.length > 0) {
            const producto = Traerproducto.recordset; // Usa solo el conjunto de resultados principal

            res.status(200).json({
                ok: true,
                mensaje: 'Producto:',
                Traerturnos: {
                    recordset: producto,
                    rowsAffected: Traerproducto.rowsAffected,
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

    export default Cargar_productos_Routes;