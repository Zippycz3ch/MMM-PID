Module.register("MMM-PublicTransportDepartures", {
  defaults: {
      apiBase: "", // Ensure this is set in your config.js
      accessToken: "", // Ensure this is set in your config.js
      stopIds: "", // Ensure this is set in your config.js
      limit: 10,
      updateInterval: 60000, // Update every minute
  },

  start: function() {
      Log.info("Starting module: " + this.name);
      this.departures = [];
      this.sendSocketNotification("CONFIG", this.config); // Send config to node_helper
  },

  // Remove loadData, processData, scheduleUpdate as they are handled by node_helper.js

  socketNotificationReceived: function(notification, payload) {
      if (notification === "DEPARTURES_DATA") {
          this.departures = payload;
          this.updateDom(1000);
      }
  },

  getDom: function() {
      var wrapper = document.createElement("div");
      if (this.departures.length === 0) {
          wrapper.innerHTML = "Loading departures...";
          wrapper.className = "dimmed light small";
          return wrapper;
      }

      var table = document.createElement("table");
      table.className = "departure-table"; // Ensure this matches the CSS class
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
      return wrapper;
  }
});
