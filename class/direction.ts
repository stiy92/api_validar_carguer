// ruta principal webservices

const WebUrl = 'http://pantera.goib.com/controlcargaws/movil.asmx';

// dejo estas conectiones si en caso tal utilizare las bse de datos
//BASE DE DATOS PRUEBA PARA ANPR EN PANTERA
const dbpantera = {

    user: 'sa',
    password: 'root',
    port: 36934,
    server: '172.30.200.200',
    database: 'venus_opp_prueba_02122020',
    options : {
    encrypt: true,
    trustServerCertificate: true,
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


module.exports = WebUrl;

