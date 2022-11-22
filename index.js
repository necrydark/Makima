const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActivityType, Partials } = require('discord.js');
// const { token } = require('./config.json');
require('dotenv').config();
// const { connect } = require('mongoose');
const fs = require('node:fs');

<<<<<<< HEAD
const { loadEvents } = require('./handlers/eventHandler');
const { loadCommands } = require('./handlers/commandHandler');
=======
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates], partials: ['MESSAGE', 'CHANNEL'] });
>>>>>>> 1a8e1b2d7dc380ca65f10693855598b6b3cbd469

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
});

// const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent], partials: [Partials.Channel, Partials.Message] });
//'MESSAGE', 'CHANNEL'


<<<<<<< HEAD
client.commands = new Collection();
// const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// for (const file of eventFiles) {
//     const event = require(`./events/${file}`);
//     if (event.once) {
//         client.once(event.name, (...args) => event.execute(...args));
//     } else {
//         client.on(event.name, (...args) => event.execute(...args))
//     }
// }
=======









>>>>>>> 1a8e1b2d7dc380ca65f10693855598b6b3cbd469
// const filter = ["nigger", "c00ns", "n1gger", "nigga","fag","f4g", "ni66er", "nig6er", "nigg3r", "nigg4","n1gg4" , "n1gg3r","chink", "ch1nk", "nigs", "n1gs", "n!gger", "n|gger", "niggur", 'n1ggur', 'n!ggur', "tranny", "trannie", "tr4nny", "tr4nnie","XyZKsOq", "r9EWkux", "SAvJYv5", "steamconm", "stearncor", "steamncon", "steamcommi", "steamcomun", "steamcommun", "steamcommunityu", "steancommunytiu", "stearncomminuty", "d1scord", "dlscord", "discorb", "discorcl", "discords-", "d1scord-", "d1scord-gift", "discordgift", "nitrogift", "discordwales", "givenitro", "free-nitro", "roblox-com", "?pantner", "give-nitro", "com/gift", "info/promo", "trade/offer", "giveaway/discord", "&token", "/airdrop", "bit.ly", "rb.gy", "short.io", "linklyhq.com", "clickmeter.com", "pixelme.me", "bl.ink", "cutt.ly", "soo.gd", "tinycc.com", "clkim.com", "tinyurl.com", "t2mio.com", "tiny.ie", "shorturl.at", "bit.do", "yourls.org", "musicjet.com", "adf.ly", "is.gd", "ru.com", ".ru", ".link", ".su", ".site", ".click"];
//"mongodb": "mongodb+srv://darkdevadmin:VsBvLuI6mArIYx51@cluster0.ya608lo.mongodb.net/?retryWrites=true&w=majority"

// client.commands = new Collection();

// const commandsFolder = fs.readdirSync("./commands");
// for (const folder of commandsFolder) {
//     const commandFiles = fs.readdirSync(`./commands/${folder}`)
//         .filter((file) => file.endsWith('.js'));
//     for (const file of commandFiles) {
//         const commandFile = require(`./commands/${folder}/${file}`);
//         client.commands.set(commandFile.data.name, commandFile);


//     }
// }



// client.on('interactionCreate', async interaction => {
//     if (!interaction.isCommand()) return;

//     const command = client.commands.get(interaction.commandName);

//     if (command.permissions && command.permissions.length > 0) {
//         if (!interaction.member.permissions.has(command.permissions)) return await interaction.reply({ content: 'You do not have permission to execute this command' })
//     }

//     if (!command) return;

//     try {
//         await command.execute(interaction);
//     } catch (error) {
//         console.error(error);
//         await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
//     }
// });



client.login(process.env.token).then(() => {
    loadEvents(client);
    loadCommands(client);
});
// connect(process.env.mongoose_URI, {
// }).then(() => console.log("Database Connected!"));