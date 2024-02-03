# MMM-PID
Magic Mirror Module for Prague Integrated Transport (PID)

[Contribution guidelines for this project](images/module.png)


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
