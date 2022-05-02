const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, 'DIRECT_MESSAGES', 'GUILD_MESSAGES', 'GUILDS'], partials: ['MESSAGE', 'CHANNEL'] });

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

const filter = ["nigger", "c00ns", "n1gger", "nigga","fag","f4g", "ni66er", "nig6er", "nigg3r", "nigg4","n1gg4" , "n1gg3r","chink", "ch1nk", "nigs", "n1gs", "n!gger", "n|gger", "niggur", 'n1ggur', 'n!ggur', "tranny", "trannie", "tr4nny", "tr4nnie","XyZKsOq", "r9EWkux", "SAvJYv5", "steamconm", "stearncor", "steamncon", "steamcommi", "steamcomun", "steamcommun", "steamcommunityu", "steancommunytiu", "stearncomminuty", "d1scord", "dlscord", "discorb", "discorcl", "discords-", "d1scord-", "d1scord-gift", "discordgift", "nitrogift", "discordwales", "givenitro", "free-nitro", "roblox-com", "?pantner", "give-nitro", "com/gift", "info/promo", "trade/offer", "giveaway/discord", "&token", "/airdrop", "bit.ly", "rb.gy", "short.io", "linklyhq.com", "clickmeter.com", "pixelme.me", "bl.ink", "cutt.ly", "soo.gd", "tinycc.com", "clkim.com", "tinyurl.com", "t2mio.com", "tiny.ie", "shorturl.at", "bit.do", "yourls.org", "musicjet.com", "adf.ly", "is.gd", "ru.com", ".ru", ".link", ".su", ".site", ".click"];


client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

        if(command.permissions && command.permissions.length > 0) {
            if(!interaction.member.permissions.has(command.permissions)) return await interaction.reply({ content: 'You do not have permission to execute this command'})
        }

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageCreate', async message => {
    // const filter = ["nigger", "c00ns", "n1gger", "nigga","fag","f4g",  "chink", "ch1nk", "nigs", "n1gs", "n!gger", "n|gger", "niggur", 'n1ggur', 'n!ggur', "tranny", "trannie", "tr4nny", "tr4nnie","XyZKsOq", "r9EWkux", "SAvJYv5", "steamconm", "stearncor", "steamncon", "steamcommi", "steamcomun", "steamcommun", "steamcommunityu", "steancommunytiu", "stearncomminuty", "d1scord", "dlscord", "discorb", "discorcl", "discords-", "d1scord-", "d1scord-gift", "discordgift", "nitrogift", "discordwales", "givenitro", "free-nitro", "roblox-com", "?pantner", "give-nitro", "com/gift", "info/promo", "trade/offer", "giveaway/discord", "&token", "/airdrop", "bit.ly", "rb.gy", "short.io", "linklyhq.com", "clickmeter.com", "pixelme.me", "bl.ink", "cutt.ly", "soo.gd", "tinycc.com", "clkim.com", "tinyurl.com", "t2mio.com", "tiny.ie", "shorturl.at", "bit.do", "yourls.org", "musicjet.com", "adf.ly", "is.gd", "ru.com", ".ru", ".link", ".su", ".site", ".click"];
    const logChannel = message.guild.channels.cache.find(ch => ch.name === "logged-users");
    const msg = message.content.toLowerCase();

    if(!logChannel) return ("Channel does not exist!");
    for (var i = 0; i < filter.length; i++) {
        const embed = new MessageEmbed()
        if(msg.includes(filter[i]) && !message.author.bot ) {
            let role = message.guild.roles.cache.find(role => role.name === 'muted')
            if(!role) {
                message.channel.send("You need to create a muted role!");
                await message.delete(); 
            } else {
                message.member.roles.add(role)
                embed.setTitle('User ID: ' + message.author.id);
                embed.setDescription("User: " + `**${message.author.tag}**` + " " + "\n" +  "This was the edited message that was sent: " + " " + `**${message.content}**`);
                logChannel.send({embeds: [embed]});
                // logChannel.send("User: " + message.author.tag + " " + "\n" + "ID: " + message.author.id + "\n" + "This was the message that was sent: " + " " + message.content);
                await message.channel.send('You sent said something bad! (Your ID has been logged)');
               await message.delete();  
            }
                     
        }
    }
})

client.on('messageUpdate', async (oldMessage, newMessage) => {
    if(oldMessage.content != newMessage.content) {
        // const filter = ["nigger", "c00ns", "n1gger", "nigga","fag","f4g",  "chink", "ch1nk", "nigs", "n1gs", "n!gger", "n|gger", "niggur", 'n1ggur', 'n!ggur', "tranny", "trannie", "tr4nny", "tr4nnie","XyZKsOq", "r9EWkux", "SAvJYv5", "steamconm", "stearncor", "steamncon", "steamcommi", "steamcomun", "steamcommun", "steamcommunityu", "steancommunytiu", "stearncomminuty", "d1scord", "dlscord", "discorb", "discorcl", "discords-", "d1scord-", "d1scord-gift", "discordgift", "nitrogift", "discordwales", "givenitro", "free-nitro", "roblox-com", "?pantner", "give-nitro", "com/gift", "info/promo", "trade/offer", "giveaway/discord", "&token", "/airdrop", "bit.ly", "rb.gy", "short.io", "linklyhq.com", "clickmeter.com", "pixelme.me", "bl.ink", "cutt.ly", "soo.gd", "tinycc.com", "clkim.com", "tinyurl.com", "t2mio.com", "tiny.ie", "shorturl.at", "bit.do", "yourls.org", "musicjet.com", "adf.ly", "is.gd", "ru.com", ".ru", ".link", ".su", ".site", ".click"];
        const logChannel = newMessage.guild.channels.cache.find(ch => ch.name === "logged-users");
        const msg = newMessage.content.toLowerCase();
    
        if(!logChannel) return ("Channel does not exist!");
        for (var l = 0; l < filter.length; l++) {
            const embed = new MessageEmbed()
            if(msg.includes(filter[l]) && !newMessage.author.bot) {
                let role = newMessage.guild.roles.cache.find(role => role.name === 'muted')
                if(!role) {
                    newMessage.channel.send("You need to create a muted role!");
                    await newMessage.delete(); 
                } else {
                    newMessage.member.roles.add(role)
                    embed.setTitle('User ID: ' + newMessage.author.id);
                    embed.setDescription("User: " + `**${newMessage.author.tag}**` + " " + "\n" +  "This was the edited message that was sent: " + " " + `**${newMessage.content}**`);
                    logChannel.send({embeds: [embed]});
                    // logChannel.send("User: " + message.author.tag + " " + "\n" + "ID: " + message.author.id + "\n" + "This was the message that was sent: " + " " + message.content);
                    await newMessage.channel.send('You said something bad! (Your ID has been logged)');
                   await newMessage.delete();  
                }
                         
            }
        }
    }
})


client.login(token);