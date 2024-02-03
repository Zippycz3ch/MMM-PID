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
    },

    // Define a function to generate unique colors based on the combination of route.short_name and trip.headsign
    getColorForCombination: function(shortName, headsign) {
        // Generate a unique hash for the combination of shortName and headsign
        const hash = shortName + headsign;
        // Use the hash to generate a color (you can use any method you prefer)
        const color = '#' + this.hashCode(hash).slice(0, 6);
        return color;
    },

    // Define a hash function (you can use any hash function you prefer)
    hashCode: function(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var character = str.charCodeAt(i);
            hash = (hash << 5) - hash + character;
        }
        return hash.toString(16);
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.departures = {};
        this.loaded = {};
        for (let i = 0; i < this.config.feeds.length; i++) {
            this.loaded[i] = false; // Flags to track if data is loaded for each feed
        }
        this.sendSocketNotification("CONFIG", this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "DEPARTURES_DATA") {
            this.departures[payload.feedId] = payload.departures;
            this.loaded[payload.feedId] = true; // Set the flag to true when data arrives
            this.updateDom();
        }
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        // Create an object to store colors for each combination of route.short_name and trip.headsign
        var colorMap = {};

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

                this.departures[i].forEach(function(departure) {
                    var row = document.createElement("tr");
                    row.className = "departure-row";

                    var nameCell = document.createElement("td");
                    nameCell.className = "departure-data";
                    nameCell.innerHTML = departure.name;

                    // Generate a unique color for the combination of route.short_name and trip.headsign
                    var combinationColor = this.getColorForCombination(departure.name, departure.endingStation);
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
