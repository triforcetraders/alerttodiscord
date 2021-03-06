const fs = require('fs')
const eventHandler = (evnt) => require(`../events/${evnt}.js`)
const config = require('../config.json')
const pageControls = require('./pageControls.js')

exports.createAllListeners = function(bot) {
  bot.on('message', function(message) {
    eventHandler('message')(bot, message)
  })

  bot.on('guildCreate', function(guild) {
    eventHandler('guildCreate')(bot, guild)
  })

  bot.on('guildDelete', function(guild) {
    eventHandler('guildDelete')(bot, guild)
  })

  bot.on('channelDelete', function(channel) {
    if (!fs.existsSync(`./sources/${channel.guild.id}.json`)) return;
    eventHandler('channelDelete')(channel)
  })

  bot.on('roleUpdate', function(oldRole, newRole) {
    if (oldRole.name === newRole.name || !fs.existsSync(`./sources/${oldRole.guild.id}.json`)) return;
    eventHandler('roleUpdate')(bot, oldRole, newRole)
  })

  bot.on('roleDelete', function(role) {
    eventHandler('roleDelete')(bot, role)
  })

  bot.on('guildUpdate', function(oldGuild, newGuild) {
    if (newGuild.name === oldGuild.name || !fs.existsSync(`./sources/${oldGuild.id}.json`)) return;
    eventHandler('guildUpdate')(bot, oldGuild, newGuild)
  })

  bot.on('messageReactionAdd', function(msgReaction, user) {
    if ((msgReaction.emoji.name !== '▶' && msgReaction.emoji.name !== '◀') || user.bot || !pageControls.has(msgReaction.message.id)) return;
    eventHandler('messageReactionAdd')(bot, msgReaction, user)
  })

}

exports.removeAllListeners = function(bot) {
  bot.removeAllListeners('message')
  bot.removeAllListeners('guildCreate')
  bot.removeAllListeners('guildUpdate')
  bot.removeAllListeners('guildDelete')
  bot.removeAllListeners('channelDelete')
  bot.removeAllListeners('roleUpdate')
  bot.removeAllListeners('roleDelete')
}
