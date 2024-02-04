{
    module: "MMM-PID",
    position: "top_left",
    config: {
        accessToken: "accessToken",
        coloredSameRoute: false, // Set to true for colored same routes or false for regular colors
        updateInterval: 5000,    // in ms
        feeds: [
            {
                aswIds: 522,
                title: "Ostrčilovo náměstí" // If no title is set, aswIds or ids is used
            },
            { 
                ids: "U522Z1P",
                limit: 2
            },
            {
                ids: "U522Z2P"
            }
        ],
    }
}, 