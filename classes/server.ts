import express from 'express';
import { SERVER_PORT } from '../globals/environment';
import socketIO from 'socket.io';
import http from 'http'
import * as socket from '../sockets/socket'

export default class Server {

    private static _instace: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;


    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);
        this.escucharSockets();
    }

    public static get instance(){
        return this._instace || (this._instace = new this());
    }

    private escucharSockets(){
        console.log('Escuchando conexiones - sockets');
        this.io.on('connection', client => {
            console.log('Cliente conectado');
            socket.mensaje(client, this.io);
            
            // Desconectar
            socket.desconectar(client);
        });
    }

    start( callback: any ){
        this.httpServer.listen(this.port, callback );
    }
}