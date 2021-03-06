const Discord = require('discord.js')
const filters = require('./util/filters.js')
const getIndex = require('./util/printFeeds.js')
const config = require('../config.json')
const fileOps = require('../util/fileOps.js')
const currentGuilds = require('../util/storage.js').currentGuilds

module.exports = function(bot, message, command, role) {

  getIndex(bot, message, command, function(rssName) {
    const guildRss = currentGuilds.get(message.guild.id)
    const rssList = guildRss.sources
    const menu = new Discord.RichEmbed()
      .setColor(config.botSettings.menuColor)
      .setAuthor('Feed Filters Customization')
      .setDescription(`**Feed Title:** ${rssList[rssName].title}\n**Feed Link:** ${rssList[rssName].link}\n\nSelect an option by typing its number, or type *exit* to cancel. Only messages that contain any of the words defined in these feed filters will be sent to Discord.\u200b\n\u200b\n`)
      .addField(`1) Add feed filter(s)`, `Add new filter(s) to a specific category in a feed.`)
      .addField(`2) Remove feed filter(s)`, `Remove existing filter(s), if any.`)
      .addField(`3) Remove all feed filters`, `Remove all filters, if any.`)
      .addField(`4) List existing filters`, `List all filters in all categories, if any.`)

    message.channel.send({embed: menu})
    .then(function(menu) {
      const filter = m => m.author.id == message.author.id;
      const collector = message.channel.createMessageCollector(filter,{time:60000});

      collector.on('collect', function(m) {
        if (m.content.toLowerCase() === 'exit') return collector.stop('Filter Action selection menu closed.');
        else if (!['1', '2', '3', '4'].includes(m.content)) return message.channel.send('That is not a valid choice. Try again.').catch(err => `Promise Warning: rssFilters 5: ${err}`);
        // 1 = Add feed filters
        if (m.content == 1) {
          collector.stop();
          return filters.add(message, rssName);
        }
        // 2 = Remove feed filters
        else if (m.content == 2) {
          collector.stop();
          return filters.remove(message, rssName);
        }

        else if (m.content == 3 || m.content == 4) {
          collector.stop();
          const foundFilters = [];
          if (rssList[rssName].filters && typeof rssList[rssName].filters === 'object') {
            for (var prop in rssList[rssName].filters)
              if (rssList[rssName].filters.hasOwnProperty(prop) && prop !== 'roleSubscriptions') foundFilters.push(prop);
          }

          if (foundFilters.length === 0) return message.channel.send('There are no feed filters assigned to this feed.').catch(err => `Promise Warning: rssFilter 2: ${err}`);

          const filterList = rssList[rssName].filters;
          // 3 = Remove all feed filters
          if (m.content == 3) {
            for (var filterCategory in filterList) {
              if (filterCategory !== 'roleSubscriptions') delete filterList[filterCategory];
            }
            if (filterList.size() === 0) delete rssList[rssName].filters;
            fileOps.updateFile(message.guild.id, guildRss);
            return message.channel.send(`All feed filters have been successfully removed from this feed.`).catch(err => `Promise Warning: rssFilters 3: ${err}`);
          }
          // 4 = List all existing filters
          else if (m.content == 4) {

            const msg = new Discord.RichEmbed()
              .setColor(config.botSettings.menuColor)
              .setAuthor('List of Assigned Filters')
              .setDescription(`**Feed Title:** ${rssList[rssName].title}\n**Feed Link:** ${rssList[rssName].link}\n\nBelow are the filter categories with their words/phrases under each.\u200b\n\u200b\n`);

            // Generate the list of filters assigned to a feed and add to embed to be sent
            for (var filterCategory in filterList)  {
              let value = ''
              if (filterCategory !== 'roleSubscriptions') {
                for (var filter in filterList[filterCategory])
                  value += `${filterList[filterCategory][filter]}\n`;
              }
              msg.addField(filterCategory, value, true)
            }
            return message.channel.send({embed: msg}).catch(err => console.log(`Promise Warning: rssFilters 4: ${err}`));
          }
        }
      })

      collector.on('end', function(collected, reason) {
        if (reason === 'time') return message.channel.send(`I have closed the menu due to inactivity.`).catch(err => {});
        else if (reason !== 'user') return message.channel.send(reason);
      })
    }).catch(err => console.log(`Commands Warning: (${message.guild.id}, ${message.guild.name}) => Could not send filters customization menu. (${err})`))
  })
}
