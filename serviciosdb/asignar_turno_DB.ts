
//requeriendo las dependencias de mssql
const sql = require('mssql');

//requeriendo las crednciales y rutas a la DB
const con = require('../class/direction');

//realizar la consulta ver turnos
export async function verturnos(codigo:any) {
    try {
//crear la instancia de la conexión con ..class/direction
const pool = await sql.connect(con);

//luego realizar la consulta
const result = await pool.request().query("select * from shifts where code = '"+codigo.Codigo+"' ")
  
sql.close();

return result;

    } catch (err:any){
        console.log(err);
    }
}
//fin de ver los turnos

    /////ver ultimo turno 
    export async function obtenerUltimoTurno(Turno:any) {
        try {

            if (Turno) {  // Verificar que Turno

            const pool = await sql.connect(con);
    
            // Consultar el último turno para el código y producto dados
            const result = await pool
                .request()
                .query(`SELECT MAX(turn) AS ultimoTurno, MAX(created_at) AS fechaturno  FROM shifts WHERE code = '${Turno.Codigo}' AND product = '${Turno.Producto}'`);
    
            // Cerrar la conexión
            sql.close();

             // Acceder a los resultados
            const ultimoTurno = result.recordset[0].ultimoTurno || 0;
            const fechaturno = result.recordset[0].fechaturno;
    
            // Devolver el último turno encontrado o 0 si no hay ninguno registrado y utlima fecha
            return { ultimoTurno, fechaturno };
            } 
            else {
                // Si Turno o Turno.Codigo no están definidos, devolver un valor predeterminado
                return 0;
            }
        } catch (err) {
            console.error('Error al obtener el último turno:', err);
            throw err;
        }
    }
    //fin ver ultimo turno

    //traer id de usuario
    export async function obtenerIduser(Turno:any) {
        try {
            const pool = await sql.connect(con);
    
            // Consultar el id del usuario
            const result = await pool
                .request()
                .query(`SELECT id  FROM users WHERE code = '${Turno.user}'`);
    
            // Cerrar la conexión
            sql.close();
    
            // Devolver el id del usuario
            return result.recordset[0].id
        } catch (err) {
            console.error('Error al obtener el último turno:', err);
            throw err;
        }
    }
    //fin traer id de usuario

    // asignar nuevo turno
   export async function asignarNuevoTurno(Turno_f: any) {
        try {
    
            const pool = await sql.connect(con);
            
            // Verifica si todos los datos requeridos están presentes
        if (!Turno_f[0].turno || !Turno_f[0].placa || !Turno_f[0].sector || !Turno_f[0].code || !Turno_f[0].sector_name || !Turno_f[0].producto ) {
                console.log('no')
                return { success: false, message: 'Todos los campos son requeridos'  };
                
        }
    
            // Insertar el nuevo turno en la base de datos Utiliza parámetros de consulta en lugar de concatenar directamente los valores
            //Esto no solo hace que tu código sea más seguro contra la inyección SQL, sino que también puede ayudar a manejar los tipos de datos de manera más efectiva.
            const result =
            await pool
                .request()
                .input('nuevoTurno', sql.Int, Turno_f[0].turno)
                .input('placa', sql.VarChar, Turno_f[0].placa)
                .input('sector', sql.VarChar, Turno_f[0].sector)
                .input('code', sql.VarChar, Turno_f[0].code)
                .input('sector_name', sql.VarChar, Turno_f[0].sector_name)
                .input('producto', sql.VarChar, Turno_f[0].producto)
                .input('generated_turn', sql.VarChar, Turno_f[0].generated)
                .input('estado', sql.VarChar, Turno_f[0].estado)
                .input('created_at', sql.DateTime, Turno_f[0].created_at)
                .input('updated_at', sql.DateTime, Turno_f[0].updated_at)
                .input('userId', sql.Int, Turno_f[0].id)
                .query(`INSERT INTO shifts (turn, plaque, sector_type, code, sector_name, product, generated_turn,
                    status, created_at, updated_at, userId) VALUES (
                @nuevoTurno,
                @placa, 
                @sector, 
                @code, 
                @sector_name, 
                @producto, 
                @generated_turn,
                @estado, 
                @created_at, 
                @updated_at, 
                @userId)`);
    
            // Cerrar la conexión
            sql.close();

            if (result.rowsAffected[0] > 0) {
                // Inserción exitosa
                console.log('Inserción exitosa:', result.rowsAffected[0], 'fila(s) afectada(s)');
                // Puedes devolver un mensaje de éxito o realizar otras acciones necesarias
                return { success: true, message: 'Inserción exitosa'  };
            } else {
                // No se insertaron filas
                console.log('No se insertaron filas');
                // Puedes devolver un mensaje de error o realizar otras acciones necesarias
                return { success: false, message: 'No se insertaron filas' };
            }
        } catch (error:any) {
            console.error('Error al realizar la inserción:', error.message);
            // Puedes devolver un mensaje de error o realizar otras acciones necesarias
            return { success: false, message: 'Error al realizar la inserción' };
        }
    
            //return ;  
    }
    // fin asignar turno
  
// verificar si la placa esta enturnada 
    export async function verificarEstadoEnturnado(Turno:any) {
        try {
            
            const pool = await sql.connect(con);
    
            // Consultar el estado "enturnado" para el código, producto y placa dados
            const result = await pool.request().query(`SELECT 
                        MAX(CASE WHEN status = 'enturnado' THEN 1 ELSE 0 END) AS estaEnturnado
                    FROM shifts 
                    WHERE code = '${Turno.Codigo}' AND product = '${Turno.Producto}' AND plaque = '${Turno.Placa}'
                `);
    
            // Cerrar la conexión
            sql.close();
    
            // Devolver si la placa está "enturnada" (true) o no (false)
            return Boolean(result.recordset[0].estaEnturnado);
        } catch (err) {
            console.error('Error al verificar el estado "enturnado":', err);
            throw err;
        }
    }
    
// cambiar estado de placa
export async function cambiarestadoturno(Turno:any){
    try {
        const pool = await sql.connect(con);

        // Actualizar el estado del turno en la tabla shifts
        const result = await pool
            .request()
            .query(`
                UPDATE shifts
                SET status = 'Cargado'
                WHERE plaque = '${Turno.Placa}'
            `);

        // Cerrar la conexión
        sql.close();

        // Verificar si se realizó la actualización exitosamente
        if (result.rowsAffected[0] > 0) {
            console.log(`Se actualizó exitosamente el estado del turno con placa ${Turno.Placa} a 'cargado'.`);
            return true; // Indica que la actualización fue exitosa
        } else {
            console.log(`No se encontró el turno con placa ${Turno.Placa} para actualizar.`);
            return false; // Indica que no se encontró el turno para actualizar
        }
    } catch (err) {
        console.error('Error al actualizar el estado del turno:', err);
        throw err;
    }

}