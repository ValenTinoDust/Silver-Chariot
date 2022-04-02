const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS] })

const { claim, daily } = require('./cmds/claims.js')
const balance = require('./cmds/balance.js')
const reset = require('./cmds/reset.js')
const buy = require('./cmds/buy.js')
const sell = require('./cmds/sell.js')
const inventory = require('./cmds/inventory.js')
const use = require("./cmds/use.js")
const log = require("./cmds/log.js")
const standlist = require("./cmds/standlist.js")

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`)
})

const prefix = "sv!"

client.on("messageCreate", msg => {
  args = msg.content.toLowerCase()
  if (args.length <= prefix.length) return //prevent empty cmds from entering switch case
  if (!args.startsWith(prefix)) return //if prefix is met allow into switch case
  args = args.substr(prefix.length)
  args = args.split(" ")
  switch (args[0]) {
    case 'ping':
      msg.channel.send("pong")
      break
    case 'c':
    case 'claim':
      claim(msg)
      break
    case 'd':
    case 'daily':
      daily(msg)
      break
    case 'bal':
    case 'balance':
      balance(msg)
      break
    case 'reset':
      reset(msg)
      break
    case 'b':
    case 'buy':
      buy(msg, args)
      break
    case 'inv':
    case 'inventory':
      inventory(msg)
      break
    case 's':
    case 'sell':
      sell(msg, args)
      break
    case "use":
      use(msg, args)
      break
    case "log":
      log(msg, args)
      break
    case "sl":
    case "standlist":
      standlist(msg)
      break
  }


})

const mySecret = process.env['TOKEN']
client.login(mySecret)