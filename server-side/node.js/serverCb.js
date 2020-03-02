heartbeatCb = (conn) => {
    return setInterval(() => {
        // Sends heart beat packet to client and checks if the client's last response time had been over time out time.
        send(conn, { type: "heartBeat", timestamp: getCurrentTime()});
    }, 1000);
};