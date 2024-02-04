Module.register("MMM-PID", {
    defaults: {
        apiBase: "https://api.golemio.cz/v2/pid/departureboards",
        feeds: [],
        updateInterval: 5000,
        coloredSameRoute: true,
        titleColor: "#FFFFFF", // Default color for the title
    },

    predefinedColors: [
        "#FF5733", "#33FF57", "#3366FF", "#FF33CC", "#FFFF33", "#33FFFF",
        "#FF3366", "#9966FF", "#FF6633", "#33FF66", "#3366CC", "#FF3399",
        "#FFFF66", "#66FFFF", "#CC3366", "#9966CC",
    ],

    start: function() {
        this.departures = {};
        this.loaded = {};
        this.retrieveColors();
        this.config.feeds.forEach((_, i) => this.loaded[i] = false);
        this.sendSocketNotification("CONFIG", this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "DEPARTURES_DATA") {
            this.departures[payload.feedId] = payload.departures;
            this.loaded[payload.feedId] = true;
            this.generateColors();
            this.updateDom();
        }
    },

    generateColors: function() {
        this.config.feeds.forEach((_, i) => {
            const departures = this.departures[i];
            if (departures) {
                departures.forEach((departure, j) => {
                    const combination = departure.name + departure.endingStation;
                    if (!(combination in this.colorMap)) {
                        this.colorMap[combination] = this.predefinedColors[j % this.predefinedColors.length];
                    }
                    departure.name = `<span style="color: ${this.colorMap[combination]};">${departure.name}</span>`;
                });
            }
        });
        this.saveColors();
    },

    saveColors: function() {
        localStorage.setItem("MMM-PID-colorMap", JSON.stringify(this.colorMap));
    },

    retrieveColors: function() {
        const storedColors = localStorage.getItem("MMM-PID-colorMap");
        if (storedColors) {
            this.colorMap = JSON.parse(storedColors);
        } else {
            this.colorMap = {};
        }
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        this.config.feeds.forEach((feedConfig, i) => {
            if (this.loaded[i]) {
                var feedWrapper = document.createElement("div");
                feedWrapper.className = "departure-feed";

                var feedTitle = document.createElement("div");
                feedTitle.className = "departure-title";
                feedTitle.style.color = this.config.titleColor; // Apply title color

                feedTitle.innerHTML = feedConfig.title || "Feed " + i;
                feedWrapper.appendChild(feedTitle);

                var table = document.createElement("table");
                table.className = "departure-table";

                const departures = this.departures[i];
                if (departures) {
                    departures.forEach((departure) => {
                        var row = document.createElement("tr");
                        row.className = "departure-row";

                        var nameCell = document.createElement("td");
                        nameCell.className = "departure-data";
                        nameCell.innerHTML = departure.name;
                        row.appendChild(nameCell);

                        var timeCell = document.createElement("td");
                        timeCell.className = "departure-data time-remaining";
                        timeCell.innerHTML = departure.timeRemaining < 1 ? "<1 min" : departure.timeRemaining + " min";
                        row.appendChild(timeCell);

                        var destinationCell = document.createElement("td");
                        destinationCell.className = "departure-data";
                        destinationCell.innerHTML = departure.endingStation;
                        row.appendChild(destinationCell);

                        table.appendChild(row);
                    });
                }

                feedWrapper.appendChild(table);
                wrapper.appendChild(feedWrapper);
            } else {
                var loadingMessage = document.createElement("div");
                loadingMessage.innerHTML = "Loading departures for Feed " + i + "...";
                loadingMessage.className = "dimmed light small";
                wrapper.appendChild(loadingMessage);
            }
        });

        return wrapper;
    }
});
