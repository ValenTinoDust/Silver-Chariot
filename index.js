const keepAlive = require("./server.js")
const Discord = require('discord.js')
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS] })
const Database = require("@replit/database")
const userDB = new Database()

const { claim, daily } = require('./cmds/claims.js')
const balance = require('./cmds/balance.js')
const { buy, sell, shop } = require('./cmds/shop.js')
const inventory = require('./cmds/inventory.js')
const use = require("./cmds/use.js")
const standlist = require("./cmds/standlist.js")
const stands = require("./cmds/stands.js")
const give = require("./cmds/give.js")
const first = require("./cmds/first.js")
const { log, reset, master, cooldown, resetDB, logKeys } = require("./cmds/log.js")
const { casino, roulette } = require("./cmds/casino.js")
const trade = require("./cmds/trade.js")
const help = require("./cmds/help.js")
const _8ball = require("./cmds/8ball.js")
const fight = require("./cmds/fight.js")

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`)
  console.log(new Date().toLocaleTimeString())
  userDB.list().then(keys => {
    if(!keys) return
    keys.forEach(key => 
      userDB.get(key).then(user => {
        user.bussy = false
        userDB.set(key, user)
      })
    )
  })
  let guild = client.guilds.cache.get('964671082705596456'), channel
  if(guild){
    channel = guild.channels.cache.get("964671082705596459")
    if(channel) channel.send("Bot restarted")
  }
})

const prefix = "sv!"

client.on("messageCreate", msg => {
  if (msg.author.bot) return
  if (msg.channel.type == 'dm') return
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
    case "r":
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
    case "trade":
      trade(msg, args)
      break
    case "help":
      help(msg)
      break
    case "resetdb":
      resetDB(msg)
      break
    case "logkeys":
      logKeys(msg)
    case "8ball":
      _8ball(msg)
      break
    case "fight":
      fight(msg)
      break
  }
})

const mySecret = process.env['S-chariotToken']
keepAlive()
client.login(mySecret)