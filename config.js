/* Magic Mirror Config Sample
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/getting-started/configuration.html#general
 * and https://docs.magicmirror.builders/modules/configuration.html
 */
let config = {
	address: "localhost", 	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/", 	// The URL path where MagicMirror is hosted. If you are using a Reverse proxy
					// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], 	// Set [] to allow all IP addresses
															// or add a specific IPv4 of 192.168.1.5 :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
															// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false, 		// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "", 	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "", 	// HTTPS Certificate path, only require when useHttps is true

	language: "en",
	locale: "en-US",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",
	// serverOnly:  true/false/"local" ,
	// local for armv6l processors, default
	//   starts serveronly and then starts chrome browser
	// false, default for all NON-armv6l devices
	// true, force serveronly mode, because you want to.. no UI on this device

	modules: [
		{
			module: "clock",
			position: "top_left",   // This can be any of the regions.
			config:
			{
				displaySeconds: false,
				dateFormat: "dddd, Do MMMM YYYY",
			}
		},	
		{
			module: "compliments",
			position: "lower_third"
		},
		{
			module: "weather",
			position: "top_right",
			config: 
				{
				type: 'current',
				apiKey: "852b641779f5522a3081cd3fb8c6af0e",
				locationID: "3067696",
                colored: true
				}
		},
        {
            module: "MMM-PID",
            position: "top_left",
            config: {
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQxMywiaWF0IjoxNzA2NjI3MTU5LCJleHAiOjExNzA2NjI3MTU5LCJpc3MiOiJnb2xlbWlvIiwianRpIjoiMmViMzMxMGMtYWM5ZS00OGNmLTkwOTktYWFlZGMyOTIwNzdlIn0.7dxNbLlK-DbF-L4WW30cgOHihU4h7kgIXe_hHD8wha4",
                feeds: [
                    {
                        aswIds: "522",
                        limit: 3
        
                    },
                    {
                        ids: "U522Z1P",
                        limit: 2
                    },
                    {
                        ids: "U522Z2P",
                        title: "Title"
                    }
                ],
            }
        }, 
        {
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						title: "Sport",
						url: "https://servis.idnes.cz/rss.aspx?c=sport"
					},
					{
						title: "New York Times",
						url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
					},			
					{
						title: "Zprávy",
						url: "https://servis.idnes.cz/rss.aspx?c=zpravodaj"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true,
                showLastSeenWhenOffline: true,
			}
		},
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
