class ClockSync {
	constructor() {
		this.startTime = process.hrtime();
	}

	getTime() {
		const time = process.hrtime(this.startTime);
		return time[0] + time[1] * 1e-9;
	}

	start(sendFunction, receiveFunction) {
		receiveFunction('clock-sync:ping', (id, clientTime) => {

			const serverTime = this.getTime();
			sendFunction('clock-sync:pong', id, clientTime, serverTime);

			//console.log('ping: %s, %s, %s', id, clientTime, serverTime);
		});
	}
}

export default ClockSync;