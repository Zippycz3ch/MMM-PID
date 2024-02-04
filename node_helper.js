var NodeHelper = require("node_helper");
var request = require("request");
var moment = require("moment");

module.exports = NodeHelper.create({
    start: function() {
        console.log("MMM-PID helper started...");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
            this.scheduleFetchDeparturesData();
        }
    },

    scheduleFetchDeparturesData: function() {
        for (let i = 0; i < this.config.feeds.length; i++) {
            this.fetchDeparturesData(this.config.feeds[i], i);
        }
        setInterval(() => {
            for (let i = 0; i < this.config.feeds.length; i++) {
                this.fetchDeparturesData(this.config.feeds[i], i);
            }
        }, this.config.updateInterval);
    },

    fetchDeparturesData: function(feed, feedIndex) {
        var self = this;
        var options = {
            url: this.config.apiBase,
            method: 'GET',
            headers: {
                'X-Access-Token': this.config.accessToken
            },
            qs: {
                limit: feed.limit || this.config.limit
            }
        };

        if (feed.ids) {
            options.qs.ids = feed.ids;
        }

        if (feed.limit) {
            options.qs.limit = feed.limit;
        }

        if (feed.aswIds) {
            options.qs.aswIds = feed.aswIds;
        }

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
                    self.sendSocketNotification("DEPARTURES_DATA", {
                        feedId: feedIndex,
                        departures: departuresData
                    });
                }
            } else {
                console.log("Error fetching departures data for Feed " + feedIndex + ": ", error);
            }
        });
    },
});
