const Database = require("@replit/database")
const userDB = new Database()

const userExample = {
  stardust: 0,
  lastClaim: null,
  lastDaily: null,
  lastStClaim: null,
  arrows: 0,
  reqArrows: 0,
  "h-discs": 0,
  "atk-discs": 0,
  stands: [],
  bussy: false
}

const masterUserExample = {
  stardust: 999999999999999,
  lastClaim: null,
  lastDaily: null,
  lastStClaim: null,
  arrows: 999999999999999,
  reqArrows: 999999999999999,
  "h-discs": 0,
  "atk-discs": 0,
  stands: [],
  bussy: false
}

userLog = (msg, args) => {
  if(!(msg.author.id == "932282133962182696" || msg.author.id == "822854239087886346")) return msg.channel.send("❌ **You are not authorised** ❌")
  target = msg.mentions.first ? msg.mentions.first : msg.author
  userDB.get(target.id).then(user => {
    if(!user || user.length < 1){
      user = userExample
      userDB.set(target.id, user)
    }
    console.log(target, user)
  })
}

resetDB = msg => {
  if(!(msg.author.id == "932282133962182696" || msg.author.id == "822854239087886346")) return msg.channel.send("❌ **You are not authorised** ❌")
  userDB.empty()
  return msg.channel.send(`Database has been reset`)
}

resetUser = msg => {
  if(!(msg.author.id == "932282133962182696" || msg.author.id == "822854239087886346")) return msg.channel.send("❌ **You are not authorised** ❌")
  const target = msg.mentions.users.first() || msg.author;
  userDB.set(target.id, userExample)
  if(target == msg.author){
    msg.channel.send(`Your stats have been reset`)
  } else {
    msg.channel.send(`<@${target.id}>'s stats have been reset`)
  }
}

logKeys = msg => {
  if(!(msg.author.id == "932282133962182696" || msg.author.id == "822854239087886346")) return msg.channel.send("❌ **You are not authorised** ❌")
  userDB.list().then(keys => {
    console.log(keys)
  })
}

master = msg => {
  if(!(msg.author.id == "932282133962182696" || msg.author.id == "822854239087886346")) return msg.channel.send("❌ **You are not authorised** ❌")
  target = msg.mentions.users.first() ? msg.mentions.users.first() : msg.author
  userDB.get(target.id).then(user => {
    userDB.set(target.id, masterUserExample)
    return msg.channel.send(`<@${target.id}> received master template`)
  })
}

resetUserCooldown = msg => {
  if(!(msg.author.id == "932282133962182696" || msg.author.id == "822854239087886346")) return msg.channel.send("❌ **You are not authorised** ❌")
  target = msg.mentions.users.first() ? msg.mentions.users.first() : msg.author
  userDB.get(target.id).then(user => {
    if(!user) return msg.channel.send(`<@${target.id}>'s cooldowns have been reset`)
    user.lastClaim = null
    user.lastDaily = null
    user.lastStClaim = null
    userDB.set(target.id, user)
    return msg.channel.send(`<@${target.id}>'s cooldowns have been reset`)
  })
}

module.exports = { log: userLog, reset: resetUser, master: master, cooldown: resetUserCooldown, resetDB: resetDB, logKeys: logKeys}