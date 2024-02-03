Module.register("MMM-PID", {
    defaults: {
        apiBase: "https://api.golemio.cz/v2/pid/departureboards",
        feeds: [
            {
                aswIds: "522"
            },
            {
                ids: "U522Z1P",
                limit: 2,
                title: "Ostrčilovo náměstí"
            },
            {
                ids: "U522Z2P"
            }
        ],
        updateInterval: 5000,
        coloredSameRoute: true, // Default to true for colored same routes
    },

    // Define an object to store colors for each combination of route.short_name and trip.headsign
    colorMap: {},

    start: function() {
        Log.info("Starting module: " + this.name);
        this.departures = {};
        this.loaded = {};
        this.retrieveColors(); // Retrieve colors from local storage
        for (let i = 0; i < this.config.feeds.length; i++) {
            this.loaded[i] = false; // Flags to track if data is loaded for each feed
        }
        this.sendSocketNotification("CONFIG", this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "DEPARTURES_DATA") {
            this.departures[payload.feedId] = payload.departures;
            this.loaded[payload.feedId] = true; // Set the flag to true when data arrives

            // Generate and store colors for each combination of route.short_name and trip.headsign
            this.generateColors();

            this.updateDom();
        }
    },

    generateColors: function() {
        for (let i = 0; i < this.config.feeds.length; i++) {
            const departures = this.departures[i];
            if (departures) {
                for (let j = 0; j < departures.length; j++) {
                    const departure = departures[j];
                    const combination = departure.name + departure.endingStation;
                    if (!(combination in this.colorMap)) {
                        // Generate a unique color based on configuration
                        if (this.config.coloredSameRoute) {
                            // Generate a pastel color
                            if (this.colorMap[combination] === undefined) {
                                this.colorMap[combination] = this.getRandomPastelColor();
                            }
                        } else {
                            // Generate a regular color
                            if (this.colorMap[combination] === undefined) {
                                this.colorMap[combination] = this.getRandomColor();
                            }
                        }
                    }
                }
            }
        }
        this.saveColors(); // Save colors to local storage
    },
    

    // Generate a random pastel color
    getRandomPastelColor: function() {
        const hue = Math.floor(Math.random() * 360); // Random hue value between 0 and 359
        const saturation = Math.floor(Math.random() * 50) + 50; // Random saturation between 50% and 100%
        const lightness = Math.floor(Math.random() * 30) + 70; // Random lightness between 70% and 100%
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },


    // Save colors to local storage
    saveColors: function() {
        localStorage.setItem("MMM-PID-colorMap", JSON.stringify(this.colorMap));
    },

    // Retrieve colors from local storage
    retrieveColors: function() {
        const storedColors = localStorage.getItem("MMM-PID-colorMap");
        if (storedColors) {
            this.colorMap = JSON.parse(storedColors);
        }
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        // Render the departures data for each feed if loaded, otherwise show loading message
        for (let i = 0; i < this.config.feeds.length; i++) {
            if (this.loaded[i]) {
                var feedWrapper = document.createElement("div");
                feedWrapper.className = "departure-feed";

                // Extract the title from stops[0].stop_name
                var feedConfig = this.config.feeds[i];
                var feedTitle = feedConfig.title || feedConfig.aswIds || feedConfig.ids || "Feed " + i;

                var title = document.createElement("div");
                title.className = "departure-title";
                title.innerHTML = feedTitle;
                feedWrapper.appendChild(title);

                var table = document.createElement("table");
                table.className = "departure-table";

                const departures = this.departures[i];
                if (departures) {
                    departures.forEach(function(departure) {
                        var row = document.createElement("tr");
                        row.className = "departure-row";

                        var nameCell = document.createElement("td");
                        nameCell.className = "departure-data";
                        nameCell.innerHTML = departure.name;

                        // Get the color for the combination of route.short_name and trip.headsign
                        const combinationColor = this.colorMap[departure.name + departure.endingStation];
                        // Apply the color to the row
                        row.style.color = combinationColor;

                        row.appendChild(nameCell);

                        var timeCell = document.createElement("td");
                        timeCell.className = "departure-data time-remaining";
                        if (departure.timeRemaining < 1) {
                            timeCell.innerHTML = "<1 min"; // Display "<1" when timeRemaining is less than 1
                        } else {
                            timeCell.innerHTML = departure.timeRemaining + " min";
                        }
                        row.appendChild(timeCell);

                        var destinationCell = document.createElement("td");
                        destinationCell.className = "departure-data";
                        destinationCell.innerHTML = departure.endingStation;
                        row.appendChild(destinationCell);

                        table.appendChild(row);
                    }, this);
                }

                feedWrapper.appendChild(table);
                wrapper.appendChild(feedWrapper);
            } else {
                // Show loading message for each feed if data is not loaded yet
                var loadingMessage = document.createElement("div");
                loadingMessage.innerHTML = "Loading departures for Feed " + i + "...";
                loadingMessage.className = "dimmed light small";
                wrapper.appendChild(loadingMessage);
            }
        }

        return wrapper;
    }
});
