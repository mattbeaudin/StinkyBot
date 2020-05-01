const Discord = require('discord.js');
const request = require('request');
require('dotenv').config();

const bot = new Discord.Client();

const HUB_ID = '5ffaeb7f-dd7f-4141-bd65-1d0ae77caaa1';
const PREFIX = '!';

var options = {
    'method': 'GET',
    'url': 'https://open.faceit.com/data/v4/hubs/' + HUB_ID + '/stats',
    'headers': {
      'Accept': 'json',
      'Authorization': 'Bearer ' + process.env.FACEIT_TOKEN
    }
};

bot.on('ready', () => {
    console.log('Online');
});

bot.on('message', message => {
    if (message.author.username === 'StinkyBot')
        return;

    let args = message.content.substring(PREFIX.length).split(' ');

    // Process command
    switch (args[0]) {
        case 'stinky':
            message.channel.send("Hello, my name is StinkyBot. Tell @boebie I wanna fuckin die.\n" +
                                "Available commands:\n!stats <username>\n" +
                                "https://www.youtube.com/watch?v=FveF-we6lcE");
            break;
        case 'stinkiest':
            let filter = args[1];
            let apiProp = 'Wins';
            
            if (filter === 'deaths') {
                apiProp = 'Deaths';
            } else if (filter === 'kills') {
                apiProp = 'Kills';
            } else if (filter === 'headshots') {
                apiProp = 'Headshots';
            } else if (filter === 'aces') {
                apiProp = 'Penta Kills';
            }

            request(options, (error, response) => {
                if (error) {
                    console.error('Error looking up stats');
                    return;
                }

                let data = JSON.parse(response.body);
                // Top player
                let topStink, secondStink = null;

                data.players.forEach((e, i) => {
                    if (!topStink) {
                        topStink = e;
                        return;
                    }

                    if (!secondStink) {
                        if (parseFloat(e.stats[apiProp]) < parseFloat(topStink.stats[apiProp])) {
                            secondStink = e;
                        }
                    }

                    if (parseFloat(e.stats[apiProp]) > parseFloat(topStink.stats[apiProp])) {
                        secondStink = topStink;
                        topStink = e;
                        return;
                    }

                    if (secondStink && parseFloat(e.stats[apiProp]) > parseFloat(secondStink.stats[apiProp])) {
                        secondStink = e;
                    }
                });

                message.channel.send(topStink.nickname + ' has the most ' + apiProp + ' at: ' + topStink.stats[apiProp]);

                if (parseFloat(secondStink.stats[apiProp]) == 0) {
                    message.channel.send('Nobody else has ' + apiProp + ". That's not very stinky.");
                    return;
                }

                message.channel.send(secondStink.nickname + ' has the second most ' + apiProp + ' at: ' + secondStink.stats[apiProp]);
            });

            break;
        case 'stats':
            if (!args[1])
                break;
            
            request(options, (error, response) => {
                if (error) {
                    console.error('Error looking up stats');
                    return;
                }
                
                let data = JSON.parse(response.body);
                let found = false;
                
                data.players.forEach((e, i) => {
                    if (e.nickname !== args[1])
                        return;
                    
                    found = true;
                    let stats = 'Kills: ' + e.stats.Kills +
                            '\nDeaths: ' + e.stats.Deaths +
                            '\nMVPs: ' + e.stats.MVPs +
                            '\nAverage K/D: ' + e.stats['Average K/D Ratio'] + 
                            '\nAverage HS%: ' + e.stats['Average Headshots %'];
                    message.channel.send("Here's the stats of " + e.nickname + ":");
                    message.channel.send(stats);
                });

                if (!found) {
                    message.channel.send("Can't find player " + args[1] + ". They must not be very stinky.\n"
                                        + "This bot can only be used with people on the Stinky Boys FaceIt Hub.");
                }
            });

            break;
    }

    console.log('User ' + message.author.username + ', issued command: !' + args[0]);
});

bot.login(process.env.DISCORD_TOKEN);
