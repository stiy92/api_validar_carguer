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
//A1 constante del server para usar la extancia de express servidor
const server = new server_1.default;
//===============================fin A1======================
server.start(() => {
    console.log(`El servidor esta corriendo en el puerto ${server.port}`);
});
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
// fin rutas
