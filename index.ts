import Server from "./class/server";
import UserRoutes from "./rutas/usuario";
import bodyParser from "body-parser";
import cors from "cors";
import BodegasRoutes from './rutas/bodegas';
import PlacasRoutes from "./rutas/Consultar_placa";
import MotonavesRoutes from './rutas/motonaves';
import PatiosRoutes from "./rutas/patios";
import Turnos_AprochesRoutes from "./rutas/turnos_aproches";
import Turnos_BodegaRoutes from "./rutas/turnos_bodega";
import Asignar_turno_Routes from "./rutas/asignar_turno";
import ConceptoRoutes from "./rutas/conceptos";
import ConfivehiRoutes from "./rutas/config_vehi";
import EmpaquesRoutes from './rutas/empaques';
import ModalidadesRoutes from "./rutas/modalidades";
import Registrar_Cargue_Routes from "./rutas/registrar_cargue";
import Asignar_turno_eth_Routes from "./rutas/asignar_turno_eth";
import Cargar_sitios_Routes from "./rutas/Cargar_sitios_cargar";
import Cargar_turnos_Routes from "./rutas/ver_turnos";

//inicializao esta dependencia para utilizar las variables de entorno
// try {
//     require('dotenv').config();
//   } catch (error:any) {
//     console.error('Error al cargar variables de entorno:', error.message);
//   }
//A1 constante del server para usar la extancia de express servidor
const server = new Server;
//===============================fin A1======================

server.start(()=>{
    console.log(`El servidor esta corriendo en el puerto ${server.port}`);
    
})
//console.log(process.env);
//middleware with bodyparser pasa estos parametros primero estos middleware deben de ir de primero ya que cuando pase la ruta user deben de existir los datos para el registro
server.app.use(bodyParser.urlencoded({ extended:true}));
server.app.use(bodyParser.json());
//end middleware

// user Cors
server.app.use(cors({ origin: true, credentials: true}));

//rutas validar usuario
server.app.use('/user', UserRoutes);
//rutas ver bodegas
server.app.use('/user', BodegasRoutes);
//rutas consultar placas
server.app.use('/user', PlacasRoutes);
//rutas consultar motonaves
server.app.use('/user', MotonavesRoutes);
//rutas consultar partios
server.app.use('/user', PatiosRoutes);
//rutas consultar turnos_Aproches
server.app.use('/user', Turnos_AprochesRoutes);
//rutas consultar turnos_Bodegas
server.app.use('/user', Turnos_BodegaRoutes);
//ruta agsirnar turno
server.app.use('/user', Asignar_turno_Routes);
//ruta consultar conceptos
server.app.use('/user', ConceptoRoutes);
//ruta consultar configuracion vehicular
server.app.use('/user', ConfivehiRoutes);
//ruta consultar empaques
server.app.use('/user', EmpaquesRoutes);
//ruta registrar cargue
server.app.use('/user', Registrar_Cargue_Routes);
//ruta registrar cargue
server.app.use('/user', ModalidadesRoutes);
//ruta ver turnos o asignar
server.app.use('/user', Asignar_turno_eth_Routes);
//ruta ver sitios
server.app.use('/user', Cargar_sitios_Routes);
//ruta ver turnos
server.app.use('/user', Cargar_turnos_Routes);



// fin rutas