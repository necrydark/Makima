const { CommandInteraction } = require("discord.js");
const blacklistSchema = require("../../schemas/blacklistSchema");


module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage) {
        if (!oldMessage.guild || oldMessage.author.bot) return;

        if (oldMessage.content === newMessage.content) {
            return;
        }

        try {
            blacklistSchema.findOne({ GuildID: oldMessage.guild.id }, async (err, data) => {
                if (data) {
                    const lowerMsg = newMessage.content.toLowerCase();
                    const splittedMsg = lowerMsg.split(' ');

                    let deleting = false;

                    await Promise.all(
                        splittedMsg.map((content) => {
                            try {
                                if (data.Words.includes(content.toLowerCase())) deleting = true;
                            }
                            catch { }
                        })
                    )
                    if (deleting) return newMessage.delete();
                }
            })
        }
        catch { }

    },
};