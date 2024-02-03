# MMM-PID
Magic Mirror Module for Prague Integrated Transport (PID)

![Screenshot of PID module](images/module.png)

- shows departures and time left from departure from selected stop or node and their end station
- stop is single stop
- node is two or more spots that share same name 

This module is using [Public Transport | Golemio API](https://api.golemio.cz/pid/docs/openapi/#/%F0%9F%9A%8F%20PID%20Departure%20Boards/get_pid_departureboards).

Sample config
```
{
    module: "MMM-PID",
    position: "top_left",
    config: {
        accessToken: "accessToken",
        feeds: [
            {
                aswIds: "522"

            },
            {
                ids: "U522Z1P",
                limit: 2
            },
            {
                ids: "U522Z2P",
                title: "Title"
            }
        ],
    }
}, 
```

Configurable paramethers
aswIds
ids
Title
limit: 10
updateInterval: 5000
coloredSameRoute: true, // Default to true for colored same routes

[Register here for API key](https://api.golemio.cz/api-keys/auth/sign-in).


Authenticate on the website https://api.golemio.cz/pid/docs/openapi/#/
![Use authenticate on the website](images/auth.png)

[Get your stop or node ID](https://api.golemio.cz/pid/docs/openapi/#/%F0%9F%A7%BE%20GTFS%20Static/get_gtfs_stops)


Get your stop or node ID using the stop name
![Get your stop or node ID](images/stops.png)

The response contains 2 stop_ids, each for one separate stop. The aswIds is the first 3 numbers in stop_id

![Screenshot of PID module](images/response.png)
StopID U754Z1P = aswIds 754