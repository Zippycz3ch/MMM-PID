# MMM-PID
Magic Mirror Module for Prague Integrated Transport


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
