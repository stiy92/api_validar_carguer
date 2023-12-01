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



// fin rutas