#Discord Feed

***
##Starting the Bot
***
1. Install Node https://nodejs.org/en/
2. Clone files into a directory
3. Use `npm install` in the directory from terminal, command prompt, etc.
4. Create and get a bot token from https://discordapp.com/developers/applications/me
5. Invite your bot to your server with a link generated from https://discordapi.com/permissions.html, putting your bot's client ID there
6. Put your bot token in config.json
7. [Customize](https://github.com/debenco/projm#configuration-and-customization) whatever you'd like in your RSS messages in config.json
8. Start the bot through `node server.js`
9. Feeds in addition to the ones in config can be [added through Discord] (https://github.com/debenco/projm#controlling-rss-feeds-through-discord)

####Built With
* [Node] (https://nodejs.org/en/)
* [Discord.js] (https://www.npmjs.com/package/discord.js)
* [Feedparser] (https://www.npmjs.com/package/feedparser)
* [Request] (https://www.npmjs.com/package/request)
* [Moment] (https://www.npmjs.com/package/moment)
* [striptags] (https://www.npmjs.com/package/striptags)
* [sqlite3] (https://www.npmjs.com/package/sqlite3)
* [mysql] (https://www.npmjs.com/package/mysql) (optional)

***
##Configuration and Customization
***
An example is provided in examples/config.json. *All* of these properties are required, with the exception of `timezone` and `sources`.

1. `token` : Bot token to login through server.js

2. `sqlType`: See [Database Selection](https://github.com/debenco/projm#database-selection)

3. `timezone`: (Optional) By default adding dates to your feeds will not show the timezone. Manually specify it here.
For example, normally it will show `Sat, January 7th 2017, 7:18 AM` as the feed's date. Specifying PST timezone will make it print `Sat, January 7th 2017, 7:18 AM (PST)`. This is *purely for visual purposes*.

4. `refreshTimeMinutes`: The bot will check for new feeds regularly at every interval specified in minutes here.

5. `databaseName`: Name of database that will be created.

6. `defaultMaxAge`: The max aged feed in days that the bot will grab if it unexpected stops.

7. `defaultMessage`: If no custom message is defined for a specific feed, this will be the message the feed will fallback to.

8. `sources`: The list of RSS feeds, in object format. See sources formatting below.

###Sources Formatting
The bare minimum for a source must be ```name```, ```link```, and ```channel``` for it to be functional. But of course customization is possible!

```javascript
"sources": {
    "name": "there",
    "link": "http://somewebsite.com/rss/",
    "channel": "website-feeds"
    }, {
    //another source
    }
}
```

1. `name`: Feed Name. If you can, try not to add spaces.

2. `link`: RSS Feed link.

3. `channel`: Can be the channel's ID, or a name. IDs are highly recommended.

4. `message`: Define a custom message for a feed. Use ```\n``` for a new line.

5. `maxAge`: If the bot stops unexpectedly, it will grab feeds younger than the maxAge in days and send on bot restart.

6. `filters`: The bot will then only send feeds to Discord with the words defined in these filters.
   * There are three filters available: `title`, `description` and `summary` - they are added as properties of `filters`.
   * For each filter, they can be a string or an array (["filter one!", "two"]) to specify more than one word/phrase. For an feed to pass the filters, every word/phrase defined in filters must exist in their respective filter (case-insensitive).

7. `embedMessage`: Define a custom embed message to go along with the text message.
   * Can be enabled or disabled with the property `enabled` (boolean).
   * Properties are defined through embedMessage.properties (as exemplified through the example). Properties include `color` ([*integer* format](https://www.shodor.org/stella2java/rgbint.html)), `authorTitle`, `authorAvatarURL`, `thumbnailURL`, `message`, `footerText`, and `attachURL` (boolean). Note that not all properties are available in every feed as some may return as undefined.

```javascript
	"sources": {
		"name": "there",
		"link": "http://somewebsite.com/rss/",
		"channel": "website-feeds",
		"filters": {
			"title": ["important", "key phrase"],
			"description": "stuff"
		},
		"embedMessage": {
			"enabled": 1,
			"properties": {
				"color": 8816239,
				"message": "My embed message is here!"
			}
		},
		"maxAge": 3
	}
```

###Database Selection
**I strongly recommend leaving this on `sqlite3` in config.json**. It can be set to sqlite3 or mysql, however through some experimentation, I have faced problems with the latter's connection failing after the bot has run continuously for less than a day. I am not sure how to solve this. sqlite3 however should be working fine.

Should you wish to try and use MySQL (and given that you already know what it is and have it installed), it is as simple as changing the login details in mysqlCred.json as well as the `sqlType` in config.json. If you don't have MySQL, it is very simple to set up. All you must do is install MySQL on your system and set up the root account with a password. The bot will handle everything else.

SQLite on the otherhand requires no setup. It will create the database in the same directory as server.js on first startup.

###Other Customizations
Putting {title}, {description}, {summary}, {author}, {link}, {image}, {date} will add the feed's respective information into the text. This can either be in the main message, or in the embed. Regular [Markdown formatting] (https://support.discordapp.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-) is possible wherever Discord allows.

`"message": "{date}\nA new feed has arrived!\n\n**{title}**\n{description}"`
***
##Controlling RSS Feeds through Discord
***
**~rssadd**: You may also add feeds through Discord through channels where the bot has permission to send messages as I provided the bare minimums in server.js. Join your server and type `~rssadd rss_link_here`.
A new entry will be made in config.json with its name in the format of channelID_feedLink, and will use the default message formatting.

**~rssremove**: To remove feeds in that channel through Discord, type `~rssremove`. The bot will show a list of active feeds in that channel, and you can select them via their number order. After selection, the feed will automatically be removed from config.json.

**~rsstest**: In addition to the above, you can use `~rsstest` in a specific channel to print out the typical properties of the RSS feed, along with a randomly chosen feed of any age - in the defined message/embed format in config.json. This was to ease the pains of having to wait for an RSS feed to come just to see how it would look once you designed it in the config. To prevent unforseen errors, it will only send the message if it's enabled in the config.

This is especially useful when you want to add the feed's title and/or description, but you don't know if they'll turn out undefined. However, if the message is too long, it will not send and instead give a promise rejection error

***
##Noteworthy Details
***
   * Custom emojis use a different format - it must be in the format of `<:emoji_name:12345>` with 12345 being the emoji's URL ID. The ID can be retrieved by getting the emoji's URL and copying the number in the URL.

   * This bot was made with private server owners in mind. Its stability beyond that is unpredictable.

   * Upon starting the bot with a never before seen RSS feed, it will all store available feeds at that time and put it into the database instead of sending it to Discord. This will prevent your server from being spammed by the bot with messages.
      * Upon starting the bot with an already seen RSS feed, it will retrieve feeds and send it to the Discord server with respect to its maxAge.

   * If you already have a bot active, you can simply use that bot's token and that bot will inherit the functionality of this RSS bot.

   * You can check the validity of your configuration through [JSONLint](http://jsonlint.com/).

   * Repurposing the bot is actually (relatively) easy since the only things that uses the Discord.js library is the message sending code (basically a couple lines in rss.js/initializeall.js), Discord channel checks in /util/, server.js and the commands directory (which stems from server.js).