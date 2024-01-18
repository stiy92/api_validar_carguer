//inicializao esta dependencia para utilizar las variables de entorno
try {
    require('dotenv').config();
  } catch (error:any) {
    console.error('Error al cargar variables de entorno:', error.message);
  };

//BASE DE DATOS PRUEBA PARA ANPR EN PANTERA
const dbpantera = {

    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
 // port: process.env.DB_PORT,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined, // Convierte el valor del puerto a un número
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options : {
    encrypt: process.env.DB_ENCRYPT === 'true' || true,
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' || true,
    // trustedconnection : false,
    // enableArithAbort : true,
    },


};

// dejo estas conectiones si en caso tal utilizare las bse de datos
const dbccarga = {

    user: 'sa',
    password: 'root',
    port: 3341,
    server: 'ccarga.goib.com',
    database: 'venus_opp',
    options : {
    encrypt: true,
    trustServerCertificate: true,
    // trustedconnection : false,
    // enableArithAbort : true,
    },

};


module.exports = dbpantera;

