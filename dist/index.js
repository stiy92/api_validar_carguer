"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./class/server"));
const usuario_1 = __importDefault(require("./rutas/usuario"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const bodegas_1 = __importDefault(require("./rutas/bodegas"));
const Consultar_placa_1 = __importDefault(require("./rutas/Consultar_placa"));
const motonaves_1 = __importDefault(require("./rutas/motonaves"));
const patios_1 = __importDefault(require("./rutas/patios"));
const turnos_aproches_1 = __importDefault(require("./rutas/turnos_aproches"));
const turnos_bodega_1 = __importDefault(require("./rutas/turnos_bodega"));
const asignar_turno_1 = __importDefault(require("./rutas/asignar_turno"));
const conceptos_1 = __importDefault(require("./rutas/conceptos"));
const config_vehi_1 = __importDefault(require("./rutas/config_vehi"));
const empaques_1 = __importDefault(require("./rutas/empaques"));
const modalidades_1 = __importDefault(require("./rutas/modalidades"));
const registrar_cargue_1 = __importDefault(require("./rutas/registrar_cargue"));
const asignar_turno_eth_1 = __importDefault(require("./rutas/asignar_turno_eth"));
const Cargar_sitios_cargar_1 = __importDefault(require("./rutas/Cargar_sitios_cargar"));
const ver_turnos_1 = __importDefault(require("./rutas/ver_turnos"));
const verproducto_1 = __importDefault(require("./rutas/verproducto"));
//inicializao esta dependencia para utilizar las variables de entorno
// try {
//     require('dotenv').config();
//   } catch (error:any) {
//     console.error('Error al cargar variables de entorno:', error.message);
//   }
//A1 constante del server para usar la extancia de express servidor
const server = new server_1.default;
//===============================fin A1======================
server.start(() => {
    console.log(`El servidor esta corriendo en el puerto ${server.port}`);
});
//console.log(process.env);
//middleware with bodyparser pasa estos parametros primero estos middleware deben de ir de primero ya que cuando pase la ruta user deben de existir los datos para el registro
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//end middleware
// user Cors
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
//rutas validar usuario
server.app.use('/user', usuario_1.default);
//rutas ver bodegas
server.app.use('/user', bodegas_1.default);
//rutas consultar placas
server.app.use('/user', Consultar_placa_1.default);
//rutas consultar motonaves
server.app.use('/user', motonaves_1.default);
//rutas consultar partios
server.app.use('/user', patios_1.default);
//rutas consultar turnos_Aproches
server.app.use('/user', turnos_aproches_1.default);
//rutas consultar turnos_Bodegas
server.app.use('/user', turnos_bodega_1.default);
//ruta agsirnar turno
server.app.use('/user', asignar_turno_1.default);
//ruta consultar conceptos
server.app.use('/user', conceptos_1.default);
//ruta consultar configuracion vehicular
server.app.use('/user', config_vehi_1.default);
//ruta consultar empaques
server.app.use('/user', empaques_1.default);
//ruta registrar cargue
server.app.use('/user', registrar_cargue_1.default);
//ruta registrar cargue
server.app.use('/user', modalidades_1.default);
//ruta ver turnos o asignar
server.app.use('/user', asignar_turno_eth_1.default);
//ruta ver sitios
server.app.use('/user', Cargar_sitios_cargar_1.default);
//ruta ver turnos
server.app.use('/user', ver_turnos_1.default);
//ruta ver productos
server.app.use('/user', verproducto_1.default);
// fin rutas
