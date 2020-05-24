connOnCloseCb = (conn) => {
    console.log("[INFO] Connection [" + conn.id + "] closed.");
    clearInterval(conn.heartBeatIntervalId);
};