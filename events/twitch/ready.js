const axios = require('axios');
const twitchChannel = require('../../schemas/twitch');
const fetch = require('node-fetch');
const { EmbedBuilder } = require('@discordjs/builders');


// const twitchNames = [
//     "Nuggie_33",
//     "odin_downtime",
//     "KrunchCrowd",
//     "shaxxxnm"
// ];

const twitchName = "kendalxd_"
const clientID = 'qzz78f6oy1b9vvzk9msela6hvxd3y0'
const secret = "nke47o9q3ubvsegiyinl9sw6edlnij"

module.exports = {
    name: 'ready',
    async execute(client) {
        setInterval(async () => {

            const tokenResponse = await fetch(
                `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${secret}&grant_type=client_credentials`,
                {
                    method: 'POST',
                },
            )

            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;



            const streamResponse = await fetch(
                `https://api.twitch.tv/helix/streams?user_login=${twitchName}`,
                {
                    method: 'GET',
                    headers: {
                        'Client-ID': clientID,
                        'Authorization': `Bearer ${accessToken}`
                    },
                },
            )

            const streamData = await streamResponse.json();



            if (streamData.data.length > 0 && streamData.data[0].type === "live") {
                const tChannel = client.channels.cache.get(twitchChannel.Channel);
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${twitchName}` })
                    .setColor(0x0099FF)
                    .setTitle(`**${streamData.data[0].title}**`)
                    .setImage(streamData.data[0].thumbnail_url.replace('{width}', '1920').replace('{height}', '1080'))
                    .setURL(`https://twitch.tv/${twitchName}`)
                    .setFooter({ text: `Playing: ${streamData.data[0].game_name} | Viewers: ${streamData.data[0].viewer_count}` })
                tChannel.send({ content: `${twitchName} is live!`, embeds: [embed] });
            }

        }, 5000)
    }
}




    // axios
            //     .get(`https://api.twitch.tv/helix/streams?user_login=${twitchName}`, {
            //         headers: {
            //             'Client-ID': clientID,
            //             'Authorization': `Bearer ${secret}`
            //         },
            //     })
            //     .then((res) => {
            //         const { data } = res;
            //         if (data.data.length > 0) {
            //             const channel = client.channels.cache.get(twitchChannel.Channel);
            //             if (channel) {
            //                 client.simpleEmbed({
            //                     text: `**${twitchName}** is now live!`,
            //                     fields: [
            //                         {
            //                             name: `📺┆Title`,
            //                             value: data.data[0].title
            //                         },
            //                         {
            //                             name: `👁┆Viewers`,
            //                             value: data.data[0].viewer_count
            //                         },
            //                         {
            //                             name: `📺┆Game`,
            //                             value: data.data[0].game_name
            //                         }
            //                     ],
            //                     type: 'channel',
            //                     channel: twitchChannel
            //                 }, channel)
            //             } else {
            //                 client.errEmbed({
            //                     text: `Channel not found!`,
            //                     type: 'channel',
            //                 })
            //             }
            //         }
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //     })