Module.register("MMM-PID", {
    defaults: {
        apiBase: "https://api.golemio.cz/v2/pid/departureboards",
        feeds: [], 
        updateInterval: 5000,
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

        // Render the departures data for each feed if loaded, otherwise show loading message
        for (let i = 0; i < this.config.feeds.length; i++) {
            if (this.loaded[i]) {
                var feedWrapper = document.createElement("div");
                feedWrapper.className = "departure-feed";

                // Extract the title from stops[0].stop_name
                var feedTitle = this.config.feeds[i].title || this.config.feeds[i].aswIds || this.config.feeds[i].ids || "Feed " + i;

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
                    row.appendChild(nameCell);

                    var timeCell = document.createElement("td");
                    timeCell.className = "departure-data time-remaining";
                    timeCell.innerHTML = departure.timeRemaining + " min";
                    row.appendChild(timeCell);

                    var destinationCell = document.createElement("td");
                    destinationCell.className = "departure-data";
                    destinationCell.innerHTML = departure.endingStation;
                    row.appendChild(destinationCell);

                    table.appendChild(row);
                });

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
