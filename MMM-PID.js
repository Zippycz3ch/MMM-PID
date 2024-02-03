Module.register("MMM-PID", {
    defaults: {
        apiBase: "",
        accessToken: "",
        ids: "",
        limit: 10,
        updateInterval: 60000,
        aswIds: "", // Add the new parameter to the defaults
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.departures = [];
        this.loaded = false; // Flag to track if data is loaded
        this.sendSocketNotification("CONFIG", this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "DEPARTURES_DATA") {
            this.departures = payload;
            this.loaded = true; // Set the flag to true when data arrives
            this.updateDom();
        }
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        // Render the departures data if loaded, otherwise show loading message
        if (this.loaded) {
            var table = document.createElement("table");
            table.className = "departure-table";

            this.departures.forEach(function(departure) {
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

            wrapper.appendChild(table);
        } else {
            // Show loading message if data is not loaded yet
            wrapper.innerHTML = "Loading departures...";
            wrapper.className = "dimmed light small";
        }

        return wrapper;
    }
});
