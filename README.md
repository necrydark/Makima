# Makima Bot


## Authors
Makima is a bot currently in development by a team of active developers team includes:

- [@necrydark](https://github.com/necrydark)  
- [@Bisquts](https://github.com/MorganMartin56)


## Requirements
- VSCode
- NodeJS v16 or higher
- MongoDB with an active cluster set up and your IP accessible to this cluster.

## APIs

We are using APIs such as waifu.pics as well as kitsu.io for our anime side of the bot. 
Waifu.pics is mainly for pictures and Kitsu.io is for searching anime and manga

- [waifu.pics](https://waifu.pics/docs)
- [kitsu.io](https://kitsu.docs.apiary.io/#)

## Features

- Moderation (Mute, Kick, Lock, Ban)
- Anime / Manga Info
- Anime / Manga Pictures
- Ticket System
- Customisable Leave and Welcome Message
- Avatar Checker


## Usage

```bash
# Fork the repo
https://github.com/necrydark/makimabot.git
 
# Open Directory
cd makimabot

# Get Packages
npm i

# Adding token and connections
Create a dotenv file in the project folder.

token=YOUR BOT TOKEN
clientID=YOUR CLIENT ID
everyone= @EVERYONE ROLE ID
ticketParent= TICKET CATEGORY ID
openTicket= OPEN TICKET CHANNEL ID
transcripts= TRANSCRIPT CHANNEL ID
mongoose_URI=MONGODB CONNECTION STRING

# Run Bot
node .
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
