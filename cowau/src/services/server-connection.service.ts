import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';

@Injectable()
export class ServerConnectionService {
    constructor(public socket:Socket){
        this.initServerConnection();
    }

    initServerConnection() {
        const socket = this.socket;
        socket.connect();
        socket.emit('request');
        // client/server handshake
        const promise = new Promise((resolve, reject) => {
            socket.on('acknowledge', (data) => {
                console.log('Connected to server!');
                resolve();
            });
        });
        return promise;
    }

}
