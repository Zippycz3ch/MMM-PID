var NodeHelper = require("node_helper");
var request = require("request");
var moment = require("moment"); // Assuming you have moment.js installed

module.exports = NodeHelper.create({
    start: function() {
        console.log("MMM-PublicTransportDepartures helper started...");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
            this.scheduleFetchDeparturesData();
        }
    },

    scheduleFetchDeparturesData: function() {
        this.fetchDeparturesData();
        setInterval(() => {
            this.fetchDeparturesData();
        }, this.config.updateInterval);
    },

    fetchDeparturesData: function() {
        var self = this;
        var options = {
            url: this.config.apiBase + "/pid/departureboards",
            method: 'GET',
            headers: {
                'X-Access-Token': this.config.accessToken
            },
            qs: {
                'ids': this.config.stopIds,
                'limit': this.config.limit
            }
        };

        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                if (data && Array.isArray(data.departures)) {
                    var departuresData = data.departures.map(function(departure) {
                        var predictedTime = moment(departure.arrival_timestamp.predicted);
                        var now = moment();
                        var timeRemaining = predictedTime.diff(now, 'minutes');
                        return {
                            name: departure.route.short_name,
                            timeRemaining: timeRemaining,
                            endingStation: departure.trip.headsign,
                        };
                    });
                    self.sendSocketNotification("DEPARTURES_DATA", departuresData);
                }
            } else {
                console.log("Error fetching departures data: ", error);
            }
        });
    },
});
