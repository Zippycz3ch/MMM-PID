{
    module: "MMM-PublicTransportGolemio",
    position: "top_right", // or any position you prefer
    config: {
        apiBase: "https://api.golemio.cz/v2/pid/departureboards",
        stopId: "U522Z1P",
        limit: 10,
        accessToken: "YOUR_ACCESS_TOKEN_HERE", // Ensure you replace this with your actual Golemio API token
        updateInterval: 60000, // Update every 60 seconds
    }
}
