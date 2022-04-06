const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS] })

const { claim, daily } = require('./cmds/claims.js')
const balance = require('./cmds/balance.js')
const { buy, sell, shop } = require('./cmds/shop.js')
const inventory = require('./cmds/inventory.js')
const use = require("./cmds/use.js")
const standlist = require("./cmds/standlist.js")
const stands = require("./cmds/stands.js")
const give = require("./cmds/give.js")
const first = require("./cmds/first.js")
const { log, reset, master, cooldown } = require("./cmds/log.js")
const { casino, roulette } = require("./cmds/casino.js")

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
    case "st":
    case "stand":
    case "stands":
      stands(msg)
      break
    case "give":
      give(msg, args)
      break
    case "f":
    case "first":
      first(msg, args)
      break
    case "master":
      master(msg)
      break
    case "roulette":
    roulette(msg, args)
      break
    case "casino":
    casino(msg, args)
      break
    case "shop":
    shop(msg, args)
      break
    case "cooldown":
      cooldown(msg)
      break
  }
})

const mySecret = process.env['TOKEN']
client.login(mySecret)