import express from "express";

// exporto por defecto el servidor de escucha
export default class Server {
    public app: express.Application;
    public port: number= 3000;

    // start the class with this constructor

    constructor() { 
        this.app =express();
    }

    //end constructor

    // listen for port

    start(callback: ()=> void ) {
     this.app.listen(this.port, callback); 
    } 
// and listen

}