const Discord = require('discord.js');
const request = require('request');
const bot = new Discord.Client();

const TOKEN = 'Njk5NTMxNjAyMjYyMzYwMTIz.XpVwjQ.4vNMeSJ20N7NbOLkki-ica3bjWc';
const FACEIT_TOKEN = '420eff92-9e3d-4a3e-aa04-2e22f84e3fa7';
const HUB_ID = '5ffaeb7f-dd7f-4141-bd65-1d0ae77caaa1';
const PREFIX = '!';

var auth = {
    'Authorization' : 'Bearer ' + FACEIT_TOKEN,
    'Accept' : 'json'
};

var options = {
    'method': 'GET',
    'url': 'https://open.faceit.com/data/v4/hubs/' + HUB_ID + '/stats',
    'headers': {
      'Accept': 'json',
      'Authorization': 'Bearer ' + FACEIT_TOKEN
    }
  };

bot.on('ready', () => {
    console.log('Online');
});

bot.on('message', message => {
    let args = message.content.substring(PREFIX.length).split(' ');

    // Process command
    switch (args[0]) {
        case 'stinky':
            message.channel.send("Hello, my name is StinkyBot. Tell @boebie I wanna fuckin die.");
            message.channel.send("Available commands:\n!stats <username>");
            message.channel.send('https://www.youtube.com/watch?v=FveF-we6lcE');
            break;
        case 'stats':
            if (!args[1])
                break;
            
            request(options, (error, response) => {
                if (error) {
                    console.log("whoops");
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
                            '\nAverage K/D: ' + e.stats['Average K/D Ratio'];
                    message.channel.send("Here's the stats of " + e.nickname + ":");
                    message.channel.send(stats);
                });

                if (!found) {
                    message.channel.send("Can't find player " + args[1] + ". They must not be very stinky.");
                }
            });

            break;
    }
});

bot.login(TOKEN);
