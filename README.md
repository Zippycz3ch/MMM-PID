# MMM-PID
Magic Mirror Module for Prague Integrated Transport


Sample config

{
    module: "MMM-PID",
    position: "top_left",
    accessToken: "your_token_here",
    config: {
        feeds: [
            {
                aswIds: "522",
            },
            {
                ids: "U522Z1P",
                limit: 10
            },
            {
                ids: "U522Z2P",
                title: "Title"
            }
        ],
    }
}
