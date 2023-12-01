"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// exporto por defecto el servidor de escucha
class Server {
    // start the class with this constructor
    constructor() {
        this.port = 3000;
        this.app = (0, express_1.default)();
    }
    //end constructor
    // listen for port
    start(callback) {
        this.app.listen(this.port, callback);
    }
}
exports.default = Server;
