Module.register("MMM-PID", {
  // Default module config.
  defaults: {
    limit: 10, // Default value set to 10.
    updateInterval: 60 * 1000, // Update every minute (adjust as needed).
  },

  start: function () {
    // Fetch data from the API on module startup and at the specified interval.
    this.getData();
    setInterval(this.getData.bind(this), this.config.updateInterval);
  },

  getData: function () {
    const headers = new Headers({
      "X-Access-Token": this.config.apiKey,
    });

    const url = `https://api.golemio.cz/v2/pid/departureboards?ids=${this.config.id}&limit=${this.config.limit}`;

    // Make an API request here.
    fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Log the received data for debugging.
        console.log("Received data from API:", data);
        // Process the data received from the API and update the module's content.
        this.updateData(data);
      })
      .catch((error) => {
        // Log any errors for debugging.
        console.error("Error fetching data:", error);
      });
  },

  updateData: function (data) {
    // Update the module's content with the received data.
    if (data && data.departures && data.departures.length > 0) {
      var wrapper = document.createElement("div");
      wrapper.className = "MMM-PID";

      // Create an unordered list to display departure information.
      var ul = document.createElement("ul");

      // Loop through departures and create list items.
      data.departures.slice(0, this.config.limit).forEach(function (departure) {
        // Extract relevant data for display.
        var tramName = departure.route.short_name || "Unknown Tram";
        var direction = departure.trip.headsign || "Unknown Direction";
        var expectedDepartureTime = departure.departure_timestamp.predicted || "Unknown Time";
        var remainingMinutes = departure.departure_timestamp.minutes || "Unknown Minutes";

        // Construct the list item with departure information.
        var li = document.createElement("li");
        li.innerHTML = `Tram Name: ${tramName}<br>`;
        li.innerHTML += `Direction: ${direction}<br>`;
        li.innerHTML += `Expected Departure Time: ${expectedDepartureTime}<br>`;
        li.innerHTML += `Remaining Minutes: ${remainingMinutes}`;

        // Append the list item to the unordered list.
        ul.appendChild(li);
      });

      // Append the unordered list to the module's wrapper.
      wrapper.appendChild(ul);

      this.updateDom(2000); // Optional: specify a fade animation duration.
    } else {
      // Display a message when no departures are available.
      var noDeparturesMessage = "No departures available.";
      var wrapper = document.createElement("div");
      wrapper.className = "MMM-PID";
      wrapper.innerHTML = noDeparturesMessage;
      this.updateDom(2000);
    }
  },

  getDom: function () {
    var wrapper = document.createElement("div");
    wrapper.className = "MMM-PID";
    wrapper.innerHTML = "Loading..."; // Display a loading message initially.
    return wrapper;
  },
});
