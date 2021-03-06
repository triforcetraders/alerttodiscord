// Check for invalid configs on startup and at the beginning of each feed retrieval cycle
const config = require('../config.json')
const currentGuilds = require('./storage').currentGuilds

exports.checkExists = function (guildId, feed, logging, initializing) {
  const guildRss = currentGuilds.get(guildId)
  let valid = true

  if (feed.enabled == 0) {
    console.log(`RSS Config Info: (${guildRss.id}, ${guildRss.name}) => Feed '${feed.link}' is disabled in channel ${feed.channel}, skipping...`);
    return false;
  }

  if (!feed.link || !feed.link.startsWith('http')){
    if (logging) console.log(`RSS Config Warning: (${guildRss.id}, ${guildRss.name}) => ${feed.link} has no valid link defined, skipping...`);
    valid = false;
  }
  else if (!feed.channel) {
    if (logging) console.log(`RSS Config Warning: (${guildRss.id}, ${guildRss.name}) => ${feed.link} has no channel defined, skipping...`);
    valid = false;
  }

  return valid;

}

exports.validChannel = function(bot, guildId, feed) {
  const guildRss = currentGuilds.get(guildId)
  if (isNaN(parseInt(feed.channel,10))) {
    const channel = bot.channels.find('name', feed.channel);
    if (!channel) {
      console.log(`RSS Config Warning: (${guildRss.id}, ${guildRss.name}) => ${rssName}'s string-defined channel was not found, skipping...`)
      return false;
    }
    else return channel;
  }
  else {
    const channel = bot.channels.get(`${feed.channel}`);
    if (!channel) {
      console.log(`RSS Config Warning: (${guildRss.id}, ${guildRss.name}) => ${feed.link}'s integer-defined channel was not found. skipping...`)
      return false;
    }
    else return channel;
  }

}
