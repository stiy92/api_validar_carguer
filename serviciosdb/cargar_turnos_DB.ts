//requeriendo las dependencias de mssql
const sql = require('mssql');

//requeriendo las crednciales y rutas a la DB
const con = require('../class/direction');

//realizar la consulta de sitios
export async function verturno(Turno:any) {
    try {
//crear la instancia de la conexión con ..class/direction
const pool = await sql.connect(con);

//luego realizar la consulta
const result = await pool.request().query(`select turn, plaque, product, created_at  from shifts where status= 'enturnado' and sector_name= '${Turno.sector}' `)
  
sql.close();

return result;

    } catch (err:any){
        console.log(err);
    }
}
//fin de ver los turnos