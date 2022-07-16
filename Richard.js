const {Discord,Client,MessageEmbed,Guild} = require('discord.js');
const client = global.client = new Client({ fetchAllMembers: true });
require("discord-reply")
let moment = require("moment");
const logs = require('discord-logs');
logs(client);
require("discord-reply")
require('discord-buttons')(client);

//// COMMAND HANDLER ////
const fs = require("fs");
const commands = new Map();
global.commands = commands;
const aliases = new Map();
global.aliases = aliases;
//// COMMAND HANDLER ////

///////////////// GLOBALS /////////////////
const conf = global.conf = require("./src/Configs/Global.Config.json");
client.login(conf.token).catch(err=> console.log("bişilerde hata var knk"))
//////////////// GLOBALS /////////////////

/////////////////// HANDLER ///////////////////
client.on("message", (message) => {
  if (message.author.bot ||!message.content.startsWith(conf.prefix) || !message.channel || message.channel.type == "dm") return;
  let args = message.content
      .substring(conf.prefix.length)
      .split(" ");
  let command = args[0];
  let bots = message.client;
  args = args.splice(1);
  let calistirici;
  if (commands.has(command)) {
    calistirici = commands.get(command);
    calistirici.execute(bots, message, args);
  } else if (aliases.has(command)) {
    calistirici = aliases.get(command);
    calistirici.execute(bots, message, args);
  }
})
    /////////////////// HANDLER ///////////////////
fs.readdir("./src/Commands", (err, files) => {
  if(err) return console.error(err);
    files = files.filter(file => file.endsWith(".js"));
    console.log('\x1b[36m%s\x1b[0m', `[ ${files.length} COMMANDS LOADED ]`);
    files.forEach(file => {
let prop = require(`./src/Commands/${file}`);
  if(!prop.config) return;
  if(typeof prop.onLoad === "function") prop.onLoad(client);
    commands.set(prop.config.name, prop);
  if(prop.config.aliases) prop.config.aliases.forEach(aliase => aliases.set(aliase, prop));
  });
});
    ///////////////////
fs.readdir("./src/Events", (err, files) => {
  if(err) return console.error(err);
    console.log('\x1b[36m%s\x1b[0m', `[ ${files.length} EVENTS LOADED ]`);
    files.filter(file => file.endsWith(".js")).forEach(file => {
  let prop = require(`./src/Events/${file}`);
  if(!prop.config) return;
      client.on(prop.config.name, prop);
      });
    });
/////////////////// HANDLER ///////////////////    
      let Veritabani = require("richard.db")
      const guildRoles = (global.guildRoles = new Veritabani(
        "./src/Models/Guild.Roles.json"
      ));
      const guildChannels = (global.guildChannels = new Veritabani(
        "./src/Models/Guild.Channels.json"
      ));
  
    function roleBackup() {
      let guild = client.guilds.cache.get(conf.guild);
      if (guild) {
        guild.roles.cache
          .filter((r) => r.name !== "@everyone" && !r.managed)
          .forEach((role) => {
            let roleChannelOverwrites = [];
            guild.channels.cache
              .filter((c) => c.permissionOverwrites.has(role.id))
              .forEach((c) => {
                let channelPerm = c.permissionOverwrites.get(role.id);
                let pushlanacak = {
                  id: c.id,
                  allow: channelPerm.allow.toArray(),
                  deny: channelPerm.deny.toArray(),
                };
                roleChannelOverwrites.push(pushlanacak);
              });
  
            guildRoles.ayarla(`${role.id}.${conf.guild}`, {
              name: role.name,
              color: role.hexColor,
              hoist: role.hoist,
              position: role.position,
              permissions: role.permissions,
              mentionable: role.mentionable,
              count: role.members.size,
              members: role.members.map((m) => m.id),
              channelOverwrites: roleChannelOverwrites,
            });
          });
      }
    }
  
     function channelBackup() {
      let guild = client.guilds.cache.get(conf.guild);
      if (guild) {
        guild.channels.cache
          .filter((kanal) => kanal.deleted !== true)
          .forEach((channel) => {
            let permissionss = {};
            let sayi = Number(0);
  
            channel.permissionOverwrites.forEach((perm) => {
              let thisPermOverwrites = {};
              perm.allow.toArray().forEach((p) => {
                thisPermOverwrites[p] = true;
              });
              perm.deny.toArray().forEach((p) => {
                thisPermOverwrites[p] = false;
              });
              permissionss[sayi] = {
                permission: perm.id == null ? guild.id : perm.id,
                thisPermOverwrites,
              };
              sayi++;
            });
  
            if (channel.type === "voice") {
              guildChannels.ayarla(`${channel.id}.${conf.guild}`, {
                name: channel.name,
                parentID: channel.parentID,
                position: channel.position,
                type: channel.type,
                permissionOverwrites: permissionss,
                userLimit: channel.userLimit,
                bitrate: channel.bitrate,
              });
            } else if (channel.type === "category") {
              guildChannels.ayarla(`${channel.id}.${conf.guild}`, {
                name: channel.name,
                position: channel.position,
                type: channel.type,
                permissionOverwrites: permissionss,
              });
            } else {
              guildChannels.ayarla(`${channel.id}.${conf.guild}`, {
                name: channel.name,
                parentID: channel.parentID,
                position: channel.position,
                nsfw: channel.nsfw,
                rateLimitPerUser: channel.rateLimitPerUser,
                type: channel.type,
                topic: channel.topic ? channel.topic : "Richard~ Backup =)",
                permissionOverwrites: permissionss,
              });
            }
          });
      }
    }
  
  client.on("ready", () => {
      setInterval(() => {
          roleBackup();
          channelBackup();
          client.guilds.cache.get(conf.guild).channels.cache.get(conf.log).send(`:white_check_mark: ${moment(Date.now()).format("L")} Tarihi itibari ile veritabanı güncellendi!`)
      }, 1000*60*60*1); // 1 saat. 1000*60*60*1
    })
  