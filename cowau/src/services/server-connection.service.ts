import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';

@Injectable()
export class ServerConnectionService {

    constructor(public socket:Socket) {
    	// this.socket = socketC;
        // this.initServerConnection();
    }

    initServerConnection() {
        this.socket.connect();
        this.socket.emit('request');
        // client/server handshake
        const promise = new Promise((resolve, reject) => {
            this.socket.on('acknowledge', (data) => {
                console.log('New client has connected to server!');
                resolve();
            });
        });
        return promise;
    }

}
