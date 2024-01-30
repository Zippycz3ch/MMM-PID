let config = {
	address: "localhost",
	port: 8080,
	basePath: "/", 
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], 

	language: "en",
	locale: "en-US",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], 
	timeFormat: 24,
	units: "metric",

	modules: [
		{
		  module: "MMM-PID",
		  position: "top_left",
		  config: {
			id: "U522Z1P",             // Your stop ID
			apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQxMywiaWF0IjoxNzA2NjI3MTU5LCJleHAiOjExNzA2NjI3MTU5LCJpc3MiOiJnb2xlbWlvIiwianRpIjoiMmViMzMxMGMtYWM5ZS00OGNmLTkwOTktYWFlZGMyOTIwNzdlIn0.7dxNbLlK-DbF-L4WW30cgOHihU4h7kgIXe_hHD8wha4",    // Your API key
			limit: 10,                      // Default value set to 10.
			updateInterval: 60 * 1000,      // Update every minute (adjust as needed).
		  }
		}
	  ]
	  
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}