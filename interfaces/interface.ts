export interface Bodega {
    Codigo: string;
    Descripcion: String;
}

export interface asignar_turno {
    Correcto: string;
    Mensaje: String;
}

export interface registrar_cargue {
    Correcto: string;
    Mensaje: String;
}

export interface Patio {
    Codigo: string;
    Descripcion: String;
}

export interface Concepto {
    Codigo: string;
    Descripcion: String;
}

export interface Empaques {
    Codigo: string;
    Descripcion: String;
}

export interface Modalidades {
    Codigo: string;
    Descripcion: String;
}

export interface Con_veh {
    Codigo: string;
    Descripcion: String;
}

export interface Usuario {
    Codigo: string;
    Clave: String;
    Valido: String;
}

export interface Motonave {
    Codigo: string;
    Descripcion: String;
}

export interface Placa {
    Cedula: string;
    Nombre_Conductor: String;
    Orden: String;
    Placa: String;
    Valido: String;
    Transportadora: String;
    Concepto: String;
    Articulo: String;
    Arribo_Motonave: String;
    Bodega: String;
    Bodega_Tipo: String;
    Bodega_Propia: String;
    Modalidad: String;
    Empaque: String;
    Nombre_Motonave: String;
    Deposito: String;
    Nombre_Articulo: String;
    Configuracion_Vehicular: String;
    Observaciones: String;
    Fecha_Entrada: String;
    Unidades: String;
    Escotilla: String;
    Tara: String;
    Peso_a_Cargar: String;
    Peso_a_Cambiar: String;
    Peso_Maximo: String;
    Saldo_al_BL: String;
    Saldo_Solicitud: String;
    De_Compartido: String;
    Urbano_Directo_Controlado: String;
    Documentacion_Validada: String;
    Deposito_Urbano : String;

}