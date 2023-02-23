const { EmbedBuilder, SlashCommandBuilder, DiscordAPIError } = require('discord.js');
const economy = require('../../schemas/economy');
const economyTimeout = require("../../schemas/economyTimeout");
const items = require("../../schemas/economyItems");
const store = require("../../schemas/economyStore");
const wait = require('node:timers/promises').setTimeout;




module.exports = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('Play the economy game in your server!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('balance')
                .setDescription('See your balance')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('beg')
                .setDescription('Beg for money')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('buy')
                .setDescription('Buy items in the Bot store')

        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear')
                .setDescription('Clear the economy')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('crime')
                .setDescription('Commit a crime')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('daily')
                .setDescription('Claim your daily money')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deposit')
                .setDescription('Deposit money to the bank')
                .addNumberOption(option => option.setName('amount').setDescription('Enter a amount').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('fish')
                .setDescription('Fish some fish')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('hourly')
                .setDescription('Claim your hourly money')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('hunt')
                .setDescription('Hunt some animals')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('monthly')
                .setDescription('Claim your monthly money')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pay')
                .setDescription('Pay a user')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription('Enter a amount').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('present')
                .setDescription('Get a weekly present')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rob')
                .setDescription('Rob a user')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('store')
                .setDescription('Show the store of this guild')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('weekly')
                .setDescription('Claim your weekly money')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('withdraw')
                .setDescription('Withdraw your money')
                .addNumberOption(option => option.setName('amount').setDescription('Enter a amount').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('work')
                .setDescription('Go to work')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('yearly')
                .setDescription('Claim your yearly money')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leaderboard')
                .setDescription('See the economy leaderboard')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('The leaderboard type that you want')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Money', value: 'money' },
                            { name: 'Bank', value: 'bank' }
                        )
                )
        ),
    /**
     * 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, user, guild } = interaction;
        const Member = options.getMember("user") || user;
        const member = guild.members.cache.get(Member.id);
        const type = options.getString('type');
        const amount = options.getNumber("amount");
        const rand = (min, max) => {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        const sub = options.getSubcommand(['balance', 'beg', 'buy', 'crime', 'daily', 'deposit',
            'fish', 'hourly', 'hunt', 'monthly', 'pay', 'present', 'rob', 'store', 'weekly', 'withdraw',
            'work', 'yearly', 'leaderboard']);
        // let coinsAmount = Math.floor((Math.random() * 5000) + 1);
        const embed = new EmbedBuilder();

        switch (sub) {
            case "balance":
                if (member.bot) return client.errNormal({
                    error: "You cannot see the balance of a bot!",
                    type: 'reply'
                }, interaction);

                economy.findOne({ GuildID: interaction.guild.id, User: member.id }, async (err, data) => {
                    if (data) {
                        let total = data.Money + data.Bank;

                        client.embed({
                            title: `${client.emotes.economy.coins}・Balance`,
                            fields: [
                                {
                                    name: `${client.emotes.economy.pocket}┆Wallet`,
                                    value: `$${data.Money}`,
                                    inline: true
                                },
                                {
                                    name: `${client.emotes.economy.bank}┆Bank`,
                                    value: `$${data.Bank}`,
                                    inline: true
                                },
                                {
                                    name: `💰┆Total`,
                                    value: `$${total}`,
                                    inline: true
                                }
                            ],
                            desc: `The current balance of \`${user.tag}\``,
                            footer: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`,
                            type: 'reply'
                        }, interaction);
                    } else {
                        await interaction.reply({ content: `This user doesn't have any money!`, ephemeral: true });
                    }
                })
                break;
            case "beg":
                let begTimeout = 180000;
                let begAmount = Math.floor((Math.random() * 10) + 1);

                economyTimeout.findOne({ GuildID: interaction.guild.id, User: user.id }, async (err, dataTime) => {
                    if (dataTime && dataTime !== null && begTimeout - (Date.now() - dataTime.Beg) > 0) {
                        let time = (dataTime.Beg / 1000 + begTimeout / 1000).toFixed(0);
                        return client.errEmbed({
                            time: time,
                            type: 'reply'
                        }, interaction);
                    } else {

                        client.succNormal({
                            text: `You've begged for some money!`,
                            fields: [
                                {
                                    name: `${client.emotes.economy.coins}┆Amount`,
                                    value: `$${begAmount}`,
                                    inline: true
                                }
                            ],
                            type: 'reply'
                        }, interaction);
                        if (dataTime) {
                            dataTime.Beg = Date.now();
                            dataTime.save();
                        } else {
                            new economyTimeout({
                                GuildID: interaction.guild.id,
                                User: user.id,
                                Beg: Date.now()
                            });
                        }

                        client.addMoney(interaction, user, begAmount)
                    }
                })
                break;
            case "buy":

                const storeData = await store.find({ GuildID: interaction.guild.id });
                if (storeData.length == 0) return interaction.reply({ content: `No shop found in this server.` });

                let labels = [];

                storeData.forEach(d => {
                    const role = interaction.guild.roles.cache.get(d.Role);

                    const generated = {
                        label: `${role.name.substr(0, 24)}.`,
                        value: role.id,
                    }
                    return labels.push(generated);
                });
                labels.push({
                    label: `Fishingrod`,
                    value: `Fishingrod`
                })
                const select = await client.generateSelect(`economyBuy`, labels);

                client.embed({
                    title: `🛒・${interaction.guild.name}'s Store`,
                    desc: `Choose a item from the menu to buy`,
                    components: [select],
                    type: 'reply'
                }, interaction)

                const filter = i => {
                    return i.user.id === interaction.user.id;
                };
                interaction.channel.awaitMessageComponent({ filter, componentType: Discord.ComponentType.StringSelect, time: 60000 }).then(async i => {
                    const role = i.values[0];
                    const buyPerson = i.guild.members.cache.get(i.user.id);

                    const data = await economy.findOne({ GuildID: i.guild.id, User: i.user.id });
                    if (i.values[0] == 'fishingrod') {
                        console.log(data)
                        if (parseInt(100) > parseInt(data.Money)) return client.errNormal({
                            error: `You don't have enough money to buy this!`,
                            type: 'update',
                            components: []
                        }, i);

                        client.removeMoney(i, i.user, parseInt(100));
                        items.findOne({ GuildID: i.guild.id, User: i.user.id }, async (err, data) => {
                            if (data) {
                                data.FishingRod = true;
                                data.save();
                            } else {
                                new items({
                                    GuildID: i.guild.id,
                                    User: i.user.id,
                                    FishingRod: true,
                                }).save();
                            }
                        })
                        return client.succNormal({
                            text: `The purchase has been successfully completed`,
                            fields: [
                                {
                                    name: `📘┆Item`,
                                    value: `Fishingrod`
                                }
                            ],
                            type: 'update',
                            components: []
                        }, i);

                    }
                    const checkStore = await store.findOne({ GuildID: i.guild.id, Role: role });

                    if (parseInt(checkStore.Amount) > parseInt(data.Money)) return client.errNormal({
                        error: `You don't have enough money to buy this!`,
                        type: 'update',
                        components: []
                    }, i);

                    client.removeMoney(i, i.user, parseInt(checkStore.Amount));
                    try {
                        await buyPerson.roles.add(role);
                    } catch (e) {
                        return client.errNormal({
                            error: `I can't add <@&${role}> to you!`,
                            type: 'update',
                            components: []
                        }, i);
                    }

                    client.succNormal({
                        text: `The purchase has been successfully completed`,
                        fields: [
                            {
                                name: `📘┆Item`,
                                value: `<@&${role}>`
                            }
                        ],
                        type: 'update',
                        components: []
                    }, i);
                })
                break;
            case "crime":
                let crimeTimeout = 600000;
                economyTimeout.findOne({ GuildID: interaction.guild.id, User: user.id }, async (err, dataTime) => {
                    if (dataTime && dataTime.Crime !== null && crimeTimeout - (Date.now() - dataTime.Crime) > 0) {
                        let time = (dataTime.Crime / 1000 + crimeTimeout / 1000).toFixed(0);
                        return client.errWait({
                            time: time,
                            type: 'reply'
                        }, interaction);
                    } else {
                        let crimes = ['Hacking', 'Burglary', 'Robbery', 'Murder', 'Dealing Drugs', 'Child Abuse', 'Arms Trade', 'Street Robbery'];

                        let result = Math.floor((Math.random() * crimes.length));
                        let result2 = Math.floor((Math.random() * 10));
                        let amount = Math.floor((Math.random() * 80) + 1);

                        if (result2 > 7) {
                            client.succNormal({
                                text: `Your crime went successfully!`,
                                fields: [
                                    {
                                        name: `🦹‍♂️┆Crime`,
                                        value: `${crimes[result]}`,
                                        inline: true
                                    },
                                    {
                                        name: `${client.emotes.economy.coins}┆Earned`,
                                        value: `$${amount}`,
                                        inline: true
                                    }
                                ],
                                type: 'reply'
                            }, interaction);

                            client.addMoney(interaction, user, amount);

                            if (dataTime) {
                                dataTime.Crime = Date.now();
                                dataTime.save();
                            } else {
                                new economyTimeout({
                                    GuildID: interaction.guild.id,
                                    User: user.id,
                                    Crime: Date.now()
                                }).save();
                            }
                        } else {
                            client.errNormal({ error: `You were caught carrying out the crime ${crimes[result]}`, type: 'reply' }, interaction);


                            if (dataTime) {
                                dataTime.Crime = Date.now();
                                dataTime.save();
                            } else {
                                new economyTimeout({
                                    GuildID: interaction.guild.id,
                                    User: user.id,
                                    Crime: Date.now()
                                }).save();
                            }
                        }
                    }
                })

                break;
            case "daily":
                let dailyTimeout = 86400000;
                let dailyAmount = Math.floor((Math.random() * 200) + 1);
                economyTimeout.findOne({ GuildID: interaction.guild.id, User: user.id }, async (err, dataTime) => {
                    if (dataTime && dataTime.Daily !== null && dailyTimeout - (Date.now() - dataTime.Daily) > 0) {
                        let time = (dataTime.Daily / 1000 + dailyTimeout / 1000).toFixed(0);
                        return client.errWait({
                            time: time,
                            type: 'reply'
                        }, interaction);
                    } else {
                        client.succNormal({
                            text: `You've collected your daily reward!`,
                            fields: [
                                {
                                    name: `${client.emotes.economy.coins}┆Amount`,
                                    value: `$${dailyAmount}`,
                                    inline: true
                                }
                            ],
                            type: 'reply'
                        }, interaction);

                        if (dataTime) {
                            dataTime.Daily = Date.now();
                            dataTime.save();
                        } else {
                            new economyTimeout({
                                GuildID: interaction.guild.id,
                                User: user.id,
                                Daily: Date.now()
                            }).save();
                        }
                        client.addMoney(interaction, user, dailyAmount);
                    }
                })
                break;
            case "deposit":
                if (!amount) return client.errUsage({ usage: "deposit [amount]", type: 'reply' }, interaction);

                if (isNaN(amount)) return client.errNormal({ error: "Enter a valid number!", type: 'reply' }, interaction);

                if (amount < 0) return client.errNormal({ error: `You can't deposit negative money!`, type: 'reply' }, interaction);


                economy.findOne({ GuildID: guild.id, User: user.id }, async (err, data) => {
                    if (data) {
                        if (data.Money < parseInt(amount)) return interaction.reply({ content: `You don't have that much money`, ephemeral: true });

                        let money = parseInt(amount);

                        data.Money -= money;
                        data.Bank += money;
                        data.save();

                        client.succNormal({
                            text: `You've have deposited some money into your bank!`,
                            fields: [
                                {
                                    name: `${client.emotes.economy.coins}┆Amount`,
                                    value: `$${amount}`,
                                    inline: true
                                }
                            ],
                            type: 'reply'
                        }, interaction);
                    } else {
                        client.errNormal({ text: `You don't have any money to deposit!`, type: 'reply' }, interaction);
                    }
                })
                break;
            case "fish":
                let fishTimeout = 60000;
                let fish =
                    ["Yellow Fish :tropical_fish:",
                        "Fat Fish :blowfish:",
                        "Blue Fish :fish:",
                        "Coconut :coconut:",
                        "Dolphin :dolphin:",
                        "Lobster :lobster:",
                        "Shark :shark:",
                        "Crab :crab:",
                        "Squid :squid:",
                        "Whale :whale2:",
                        "Shrimp :shrimp:",
                        "Octopus :octopus:",
                        "Diamond :gem:"];

                let randFish = rand(0, parseInt(fish.length));
                let randrod = rand(15, 30);

                let fishToWin = fish[randFish];

                const userItems = await items.findOne({ GuildID: interaction.guild.id, User: user.id });

                if (!userItems || userItems.FishingRod == false) return client.errNormal({ error: "You have to buy a fishing rod!", type: 'reply' }, interaction);

                if (userItems) {
                    if (userItems.FishingRodUsage >= randrod) {
                        userItems.FishingRod = false;
                        userItems.save();

                        return client.errNormal({ error: "Your fishing rod has broken! Go buy a new one!", type: 'reply' }, interaction);

                    }
                }

                economyTimeout.findOne({ GuildID: interaction.guild.id, User: user.id }, async (err, dataTime) => {
                    if (dataTime && dataTime.Fish !== null && fishTimeout - (Date.now() - dataTime.Fish) > 0) {
                        let time = (dataTime.Fish / 1000 + fishTimeout / 1000).toFixed(0);
                        return client.errWait({ time: time, type: 'reply' }, interaction);

                    } else {

                        client.succNormal({ text: `You've fished and gotten a ${fishToWin}`, type: 'reply' }, interaction);

                        if (userItems) {
                            userItems.FishingRodUsage += 1;
                            userItems.save();
                        }

                        if (dataTime) {
                            dataTime.Fish = Date.now();
                            dataTime.save();
                        } else {
                            new economyTimeout({
                                GuildID: interaction.guild.id,
                                User: user.id,
                                Fish: Date.now()
                            }).save();
                        }
                    }
                })

                break;
            case "hourly":
                let hourlyTimeout = 3600000;
                let hourlyAmount = Math.floor((Math.random() * 10) + 1);
                economyTimeout.findOne({ GuildID: interaction.guild.id, User: user.id }, async (err, dataTime) => {
                    if (dataTime && dataTime.Hourly !== null && hourlyTimeout - (Date.now() - dataTime.Hourly) > 0) {
                        let time = (dataTime.Hourly / 1000 + hourlyTimeout / 1000).toFixed(0);
                        return client.errWait({
                            time: time,
                            type: 'reply'
                        }, interaction);
                    } else {
                        client.succNormal({
                            text: `You've collected your hourly reward!`,
                            fields: [
                                {
                                    name: `${client.emotes.economy.coins}┆Amount`,
                                    value: `$${hourlyAmount}`,
                                    inline: true
                                }
                            ],
                            type: 'reply'
                        }, interaction);


                        if (dataTime) {
                            dataTime.Hourly = Date.now();
                            dataTime.save();
                        } else {
                            new economyTimeout({
                                GuildID: interaction.guild.id,
                                User: user.id,
                                Hourly: Date.now()
                            }).save();
                        }
                        client.addMoney(interaction, user, hourlyAmount);

                    }
                })
                break;
            case "hunt":
                let huntTimeout = 60000;
                let hunt =
                    ["Rabbit :rabbit:",
                        "Frog :frog:",
                        "Monkey :monkey:",
                        "Chicken :chicken:",
                        "Wolf :wolf:",
                        "Rooster :rooster:",
                        "Turkey :turkey:",
                        "Chipmunk :chipmunk:",
                        "Water Buffalo :water_buffalo:",
                        "Race Horse :racehorse:",
                        "Pig :pig:",
                        "Snake :snake:",
                        "Cow :cow:"];

                let randHunt = rand(0, parseInt(hunt.length));

                let huntToWin = hunt[randHunt];


                economyTimeout.findOne({ GuildID: interaction.guild.id, User: user.id }, async (err, dataTime) => {
                    if (dataTime && dataTime.Hunt !== null && huntTimeout - (Date.now() - dataTime.Hunt) > 0) {
                        let time = (dataTime.Hunt / 1000 + huntTimeout / 1000).toFixed(0);
                        return client.errWait({ time: time, type: 'reply' }, interaction);

                    } else {


                        if (dataTime) {
                            dataTime.Hunt = Date.now();
                            dataTime.save();
                        } else {
                            new economyTimeout({
                                GuildID: interaction.guild.id,
                                User: user.id,
                                Hunt: Date.now()
                            }).save();
                        }


                        await interaction.deferReply();
                        await wait(4000);
                        client.succNormal({ text: `You've hunted and gotten a ${huntToWin}`, type: 'reply' }, interaction);

                    }
                })
                break;
            case "monthly":
                let monthlyTimeout = 2419200000;
                let monthlyAmount = Math.floor((Math.random() * 1000) + 1);
                economyTimeout.findOne({ GuildID: interaction.guild.id, User: user.id }, async (err, dataTime) => {
                    if (dataTime && dataTime.Monthly !== null && monthlyTimeout - (Date.now() - dataTime.Monthly) > 0) {
                        let time = (dataTime.Monthly / 1000 + monthlyTimeout / 1000).toFixed(0);
                        return client.errWait({
                            time: time,
                            type: 'reply'
                        }, interaction);
                    } else {

                        client.succNormal({
                            text: `You've collected your monthly reward!`,
                            fields: [
                                {
                                    name: `${client.emotes.economy.coins}┆Amount`,
                                    value: `$${monthlyAmount}`,
                                    inline: true
                                }
                            ],
                            type: 'reply'
                        }, interaction);

                        if (dataTime) {
                            dataTime.Monthly = Date.now();
                            dataTime.save();
                        } else {
                            new economyTimeout({
                                GuildID: interaction.guild.id,
                                User: user.id,
                                Monthly: Date.now()
                            }).save();
                        }
                        client.addMoney(interaction, user, monthlyAmount);
                    }
                })
                break;
            case "pay":

                if (amount < 0) return client.errNormal({ error: `You can't pay negative money`, type: 'reply' }, interaction);

                if (user.id == interaction.user.id) {
                    return client.errNormal({
                        error: "You cannot pay money to yourself!",
                        type: 'reply'
                    }, interaction)
                }

                economy.findOne({ GuildID: interaction.guild.id, User: interaction.user.id }, async (err, data) => {
                    if (data) {
                        if (data.Money < parseInt(amount)) return client.errNormal({ error: `You don't have that much money!`, type: 'reply' }, interaction);
                        let money = parseInt(amount);

                        data.Money -= money;
                        data.save();

                        client.addMoney(interaction, user, money);


                        client.succNormal({
                            text: `You have payed some money to a user!`,
                            fields: [
                                {
                                    name: `👤┆User`,
                                    value: `$${user}`,
                                    inline: true
                                },
                                {
                                    name: `${client.emotes.economy.coins}┆Amount`,
                                    value: `$${amount}`,
                                    inline: true
                                }
                            ],
                            type: 'reply'
                        }, interaction);
                    } else {
                        client.errNormal({ text: `You don't have any money!`, type: 'reply' }, interaction);
                    }
                })
                // member
                break;
            case "present":
                let presentTimeout = 604800000;
                let presentAmount = Math.floor(Math.random() * 1000) + 1;
                economyTimeout.findOne({ GuildID: interaction.guild.id, User: user.id }, async (err, dataTime) => {
                    if (dataTime && dataTime.Present !== null && presentTimeout - (Date.now() - dataTime.Present) > 0) {
                        let time = (dataTime.Present / 1000 + presentTimeout / 1000).toFixed(0);
                        return client.errWait({
                            time: time,
                            type: 'reply'
                        }, interaction);

                    } else {
                        client.succNormal({
                            text: `You've collected your present reward!`,
                            fields: [
                                {
                                    name: `${client.emotes.economy.coins}┆Amount`,
                                    value: `$${amount}`,
                                    inline: true
                                }
                            ],
                            type: 'reply'
                        }, interaction);

                        if (dataTime) {
                            dataTime.Present = Date.now();
                            dataTime.save();
                        } else {
                            new economyTimeout({
                                GuildID: interaction.guild.id,
                                User: user.id,
                                Present: Date.now()
                            }).save();
                        }
                        client.addMoney(interaction, user, presentAmount);
                    }
                })
                break;
            case "rob":
                if (member.bot) return client.errNormal({
                    error: "You cannot rob a bot!",
                    type: 'reply'
                }, interaction);

                try {
                    let robTimeout = 60000;
                    economyTimeout.findOne({ GuildID: interaction.guild.id, User: user.id }, async (err, dataTime) => {
                        if (dataTime && dataTime.Rob !== null && robTimeout - (Date.now() - dataTime.Rob) > 0) {
                            let time = (dataTime.Rob / 1000 + robTimeout / 1000).toFixed(0);
                            return client.errWait({ time: time, type: 'reply' }, interaction);
                        } else {
                            economy.findOne({ GuildID: interaction.guild.id, User: interaction.user.id }, async (err, data) => {
                                if (data) {
                                    if (authorData.Money < 200) return client.errNormal({ error: `You need atleast 200 coins in your wallet to rob someone!`, type: 'reply' }, interaction);

                                    economy.findOne({ GuildID: interaction.guild.id, User: interaction.user.id }, async (err, targetData) => {
                                        if (targetData) {
                                            var targetMoney = targetData.Money;
                                            if (targetData = undefined || !targetData || targetMoney == 0 || targetMoney < 0) {
                                                return client.errNormal({ error: `${user.username} does not have anything you can rob!`, type: 'reply' }, interaction);
                                            }

                                            if (dataTime) {
                                                dataTime.Rob = Date.now();
                                                dataTime.save();
                                            }
                                            else {
                                                new economyTimeout({
                                                    GuildID: interaction.guild.id,
                                                    User: interaction.user.id,
                                                    Rob: Date.now()
                                                }).save();
                                            }

                                            var random = Math.floor(Math.random() * 100) + 1;
                                            if (targetMoney < random) {
                                                random = targetMoney;

                                                authorData.Money += targetMoney;
                                                authorData.save();

                                                client.removeMoney(interaction, user, targetMoney);
                                            }
                                            else {
                                                authorData.Money += random;
                                                authorData.save();

                                                client.removeMoney(interaction, user, random);
                                            }

                                            client.succNormal({
                                                text: `Your robbed a user and got away!`,
                                                fields: [
                                                    {
                                                        name: `👤┆User`,
                                                        value: `${user}`,
                                                        inline: true
                                                    },
                                                    {
                                                        name: `${client.emotes.economy.coins}┆Robbed`,
                                                        value: `$${random}`,
                                                        inline: true
                                                    }
                                                ],
                                                type: 'reply'
                                            }, interaction);
                                        } else {
                                            return client.errNormal({ error: `${user.username} does not have anything you can rob!`, type: 'reply' }, interaction);
                                        }
                                    })
                                }
                            })
                        }
                    })
                } catch { }
                break;
            case "store":
                store.find({ GuildID: interaction.guild.id }, async (err, data) => {
                    if (data && data.length > 0) {
                        const lb = storeData.map(e => `**<@&${e.Role}>** - $${e.Amount} \n**To buy:** \`buy ${e.Role}\``);
                        await client.createLeaderboard(`🛒・${interaction.guild.name}'s Store`, lb, interaction);
                        client.embed({
                            title: `🛒・Bot's Store`,
                            desc: `**Fishingrod** - ${client.emotes.economy.coins} $100 \n**To buy:** \`buy fishingrod\``,
                        }, interaction.channel);
                    } else {
                        client.errNormal({
                            error: `No store found in this guild!`,
                            type: 'reply'
                        }, interaction);
                    }
                })
                break;
            case "weekly":
                let weeklyTimeout = 604800000;
                let weeklyAmount = Math.floor((Math.random() * 10) + 1);
                economyTimeout.findOne({ GuildID: interaction.guild.id, User: user.id }, async (err, dataTime) => {
                    if (dataTime && dataTime.Weekly !== null && weeklyTimeout - (Date.now() - dataTime.Weekly) > 0) {
                        let time = (dataTime.Weekly / 1000 + weeklyTimeout / 1000).toFixed(0);
                        return client.errWait({
                            time: time,
                            type: 'reply'
                        }, interaction);
                    } else {
                        client.succNormal({
                            text: `You've collected your weekly reward!`,
                            fields: [
                                {
                                    name: `${client.emotes.economy.coins}┆Amount`,
                                    value: `$${weeklyAmount}`,
                                    inline: true
                                }
                            ],
                            type: 'reply'
                        }, interaction);

                        if (dataTime) {
                            dataTime.Weekly = Date.now();
                            dataTime.save();
                        } else {
                            new economyTimeout({
                                GuildID: interaction.guild.id,
                                User: user.id,
                                Weekly: Date.now()
                            }).save();
                        }
                        client.addMoney(interaction, user, weeklyAmount);
                    }
                })
                break;
            case "withdraw":
                if (!amount) return client.errUsage({ usage: "withdraw [amount]", type: 'reply' }, interaction);

                if (isNaN(amount)) return client.errNormal({ error: "Enter a valid number!", type: 'reply' }, interaction);

                if (amount <= 0) return client.errNormal({ error: `You can't withdraw negative money!`, type: 'reply' }, interaction);

                economy.findOne({ GuildID: guild.id, User: user.id }, async (err, data) => {
                    if (data) {
                        if (data.Bank === 0) return interaction.reply({ content: `You dont't have money in the bank!`, ephemeral: true });

                        let money = parseInt(amount);

                        data.Money += money;
                        data.Bank -= money;
                        data.save();


                        client.succNormal({
                            text: `You've have withdrawn some money from your bank!`,
                            fields: [
                                {
                                    name: `${client.emotes.economy.coins}┆Amount`,
                                    value: `$${amount}`,
                                    inline: true
                                }
                            ],
                            type: 'reply'
                        }, interaction);
                    } else {
                        client.errNormal({ text: `You don't have any money to withdraw!`, type: 'reply' }, interaction);
                    }
                })
                break;
            case "work":
                let workTimeout = 600000;
                economyTimeout.findOne({ GuildID: interaction.guild.id, User: user.id }, async (err, dataTime) => {
                    if (dataTime && dataTime.Work !== null && workTimeout - (Date.now() - dataTime.Work) > 0) {
                        let time = (dataTime.Work / 1000 + workTimeout / 1000).toFixed(0);
                        return client.errWait({
                            time: time,
                            type: 'reply'
                        }, interaction);
                    } else {
                        let work = ['Programmer', 'Hacker', 'Waiter', 'Busboy', 'Chief', 'Mechanic']
                        let result = Math.floor((Math.random() * work.length));
                        let amount = Math.floor((Math.random() * 80) + 1);

                        client.succNormal({ text: `You worked as a ${work[result]} and earned: **${client.emotes.economy.coins} $${amount}**`, type: 'reply' }, interaction);

                        client.succNormal({
                            text: `You've wokred and earned some money!`,
                            fields: [
                                {
                                    name: `🦹‍♂️┆Crime`,
                                    value: `${work[result]}`,
                                    inline: true
                                },
                                {
                                    name: `${client.emotes.economy.coins}┆Earned`,
                                    value: `$${amount}`,
                                    inline: true
                                }
                            ],
                            type: 'reply'
                        }, interaction);
                        if (dataTime) {
                            dataTime.Work = Date.now();
                            dataTime.save();
                        } else {
                            new economyTimeout({
                                GuildID: interaction.guild.id,
                                User: user.id,
                                Work: Date.now()
                            }).save();
                        }
                        client.addMoney(interaction, user, amount);

                    }
                })
                break;
            case "yearly":
                let yearlyTimeout = 604800000;
                let yearlyAmount = Math.floor((Math.random() * 5000) + 1);
                economyTimeout.findOne({ GuildID: interaction.guild.id, User: user.id }, async (err, dataTime) => {
                    if (dataTime && dataTime.Yearly !== null && yearlyTimeout - (Date.now() - dataTime.Yearly) > 0) {
                        let time = (dataTime.Yearly / 1000 + yearlyTimeout / 1000).toFixed(0);
                        return client.errWait({
                            time: time,
                            type: 'reply'
                        }, interaction);
                    } else {
                        client.succNormal({
                            text: `You've collected your yearly reward of **${client.emotes.economy.coins} $${yearlyAmount}**`,
                            type: 'reply'
                        }, interaction);

                        client.succNormal({
                            text: `You've collected your yearly reward!`,
                            fields: [
                                {
                                    name: `${client.emotes.economy.coins}┆Earned`,
                                    value: `$${yearlyAmount}`,
                                    inline: true
                                }
                            ],
                            type: 'reply'
                        }, interaction);

                        if (dataTime) {
                            dataTime.Yearly = Date.now();
                            dataTime.save();
                        } else {
                            new economyTimeout({
                                GuildID: interaction.guild.id,
                                User: user.id,
                                Yearly: Date.now()
                            }).save();
                        }
                        client.addMoney(interaction, user, yearlyAmount);
                    }
                })

                break;
            case "leaderboard":
                if (type == "money") {
                    const rawLB = await economy.find({ GuildID: guild.id }).sort(([['Money', 'descending']]));
                    if (!rawLB) return client.errNormal({
                        error: "No data found!",
                        type: 'reply'
                    }, interaction);

                    const lb = rawLB.map(e => `**${rawLB.findIndex(i => i.Guild === interaction.guild.id && i.User === e.User) + 1}** | <@!${e.User}> - \`$${e.Money}\``);
                    await client.createLeaderboard(`🪙・Money - ${interaction.guild.name}`, lb, interaction);

                    // embed.setColor('Random')
                    //     .setTitle('Money Leaderboard')
                    //     .setDescription(lb.join("\n\n"))
                    //     .setTimestamp()
                    //     .setFooter({ text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
                    // await interaction.reply({ embeds: [embed] });
                } else if (type == "bank") {
                    const rawLB = await economy.find({ GuildID: guild.id }).sort(([['Bank', 'descending']]));
                    if (!rawLB) return client.errNormal({
                        error: "No data found!",
                        type: 'reply'
                    }, interaction);

                    const lb = rawLB.map(e => `**${rawLB.findIndex(i => i.Guild === interaction.guild.id && i.User === e.User) + 1}** | <@!${e.User}> - \`$${e.Bank}\``);
                    await client.createLeaderboard(`🏦・Bank - ${interaction.guild.name}`, lb, interaction);
                    // embed.setColor('Random')
                    //     .setTitle('Bank Leaderboard')
                    //     .setDescription(lb.join("\n\n"))
                    //     .setTimestamp()
                    //     .setFooter({ text: `Requested by: ${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
                    // await interaction.reply({ embeds: [embed] });
                }
                break;
        }

    }
}
