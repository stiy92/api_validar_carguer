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

//A1 constante del server para usar la extancia de express servidor
const server = new Server;
//===============================fin A1======================

server.start(()=>{
    console.log(`El servidor esta corriendo en el puerto ${server.port}`);
    
})
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


// fin rutas