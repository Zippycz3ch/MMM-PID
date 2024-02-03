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
        coloredSameRoute: true,
    },

    predefinedColors: [
        "#FF5733",
        "#33FF57",
        "#3366FF",
        "#FF33CC",
        "#FFFF33",
        "#33FFFF",
        "#FF3366",
        "#9966FF",
    ],

    start: function() {
        this.departures = {};
        this.loaded = {};
        this.retrieveColors();
        for (let i = 0; i < this.config.feeds.length; i++) {
            this.loaded[i] = false;
        }
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
        for (let i = 0; i < this.config.feeds.length; i++) {
            const departures = this.departures[i];
            if (departures) {
                for (let j = 0; j < departures.length; j++) {
                    const departure = departures[j];
                    const combination = departure.name + departure.endingStation;
                    if (!(combination in this.colorMap)) {
                        this.colorMap[combination] = this.predefinedColors[j % this.predefinedColors.length];
                    }
                    const color = this.colorMap[combination];
                    departure.name = `<span style="color: ${color};">${departure.name}</span>`;
                    departure.timeRemaining = `<span style="color: ${color};">${departure.timeRemaining}</span>`;
                    departure.endingStation = `<span style="color: ${color};">${departure.endingStation}</span>`;
                }
            }
        }
        this.saveColors();
    },

    getRandomPastelColor: function() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 50) + 50;
        const lightness = Math.floor(Math.random() * 30) + 70;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },

    saveColors: function() {
        localStorage.setItem("MMM-PID-colorMap", JSON.stringify(this.colorMap));
    },

    retrieveColors: function() {
        const storedColors = localStorage.getItem("MMM-PID-colorMap");
        if (storedColors) {
            this.colorMap = JSON.parse(storedColors);
        }
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        for (let i = 0; i < this.config.feeds.length; i++) {
            if (this.loaded[i]) {
                var feedWrapper = document.createElement("div");
                feedWrapper.className = "departure-feed";

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

                        const combinationColor = this.colorMap[departure.name + departure.endingStation];
                        row.style.color = combinationColor;

                        row.appendChild(nameCell);

                        var timeCell = document.createElement("td");
                        timeCell.className = "departure-data time-remaining";
                        if (departure.timeRemaining < 1) {
                            timeCell.innerHTML = "<1 min";
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
                var loadingMessage = document.createElement("div");
                loadingMessage.innerHTML = "Loading departures for Feed " + i + "...";
                loadingMessage.className = "dimmed light small";
                wrapper.appendChild(loadingMessage);
            }
        }

        return wrapper;
    }
});
