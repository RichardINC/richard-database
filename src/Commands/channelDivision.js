const { Discord, MessageEmbed } = require("discord.js");

  module.exports.config = {
  name: "setup",
  aliases: ["setup", "kur"],
  usage: "setup ID",
};

module.exports.execute = async(client, message, args) => {
  

if(message.author.id !== conf.owner) return;
let icerik = args[0];
if(!icerik) return message.lineReplyNoMention(`Hatalı Kullanim. \`Örnek: ${conf.prefix}setup ID\``);
if(!Number(icerik)) return message.lineReplyNoMention(`Hatalı Kullanim. \`Örnek: ${conf.prefix}setup ID\``);

let veri = guildChannels.cek(`${icerik}.${conf.guild}`);
if(!veri) return message.lineReplyNoMention(`Veritabanında belirtilen Kanal ID'sine ait veri bulunamadı!`);
if(veri.type === "category") {
    if(!veri.name) return message.lineReplyNoMention(`Veritabanında belirtilen Kategori ID'sine ait hasarlı veriler bulundu! [isim]`);
    if(!veri.permissionOverwrites) return message.lineReplyNoMention(`Veritabanında belirtilen Kategori ID'sine ait hasarlı veriler bulundu! [izin]`);  

    await message.lineReplyNoMention(` Veritabanında belirtilen Kategori ID'sine ait veri bulundu ve veriler aşağıda listelendi;
    
**Kategori Adı**: \`${veri.name}\`
**Kategori Yeri**: \`${veri.position}\``).then(msg => {
        msg.react("✅");
      
        const onay = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
      
        const collect = msg.createReactionCollector(onay, { time: 60000 });
        
        collect.on("collect", async r => {
          msg.delete().catch(err => console.log(`Mesaj silinemedi.`));
          message.guild.channels.create(veri.name, {type: veri.type}).then(channel => {
            channel.setPosition(veri.position);
            message.lineReplyNoMention(`Kategori Kuruldu kanal izinleri ve yeri ayarlandı.`)      
            if(Object.keys(veri.permissionOverwrites[0]).length > 0) {
                for (let i = 0; i < Object.keys(veri.permissionOverwrites[0]).length; i++) {
                  channel.createOverwrite(veri.permissionOverwrites[0][i].permission, veri.permissionOverwrites[0][i].thisPermOverwrites);
                };
            };
  
          })
      });
      });
      
} else if(veri.type === "text") {
    if(!veri.name) return message.lineReplyNoMention(`Veritabanında belirtilen Kanal ID'sine ait hasarlı veriler bulundu! [isim]`);
    if(!veri.permissionOverwrites) return message.lineReplyNoMention(`Veritabanında belirtilen Kanal ID'sine ait hasarlı veriler bulundu! [izin]`);
    let parentInfo;
    if(veri.parentID) parentInfo = veri.parentID;
    if(!veri.parentID && veri.parentID === null) parentInfo = "Bulunmuyor";
    let ayirma;
    if(veri.nsfw === true) ayirma = "Açık";
    if(veri.nsfw === false) ayirma = "Kapalı";
    await message.lineReplyNoMention(`Veritabanında belirtilen Kanal ID'sine ait veri bulundu ve veriler aşağıda listelendi;
    
**Kanal Adı**: \`${veri.name}\`
**Kanal Kategorisi**: \`${parentInfo}\`
**Kanal NSFW**: \`${ayirma}\`
**Kanal Açıklama**: \`${veri.topic}\``).then(msg => {
        msg.react("✅");
      
        const onay = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
      
        const collect = msg.createReactionCollector(onay, { time: 60000 });
        
        collect.on("collect", async r => {
          msg.delete().catch(err => console.log(`Mesaj silinemedi.`));
            message.guild.channels.create(veri.name, {type: veri.type}).then(channel => {
              message.lineReplyNoMention(` Kanal Kuruldu kanal izinleri ve yeri ayarlandı.`)        
                channel.setRateLimitPerUser(veri.setRateLimitPerUser);
                channel.setTopic(veri.topic);
                channel.setParent(veri.parentID);
                channel.setPosition(veri.position);

                if(Object.keys(veri.permissionOverwrites[0]).length > 0) {
                  for (let i = 0; i < Object.keys(veri.permissionOverwrites[0]).length; i++) {
                    channel.createOverwrite(veri.permissionOverwrites[0][i].permission, veri.permissionOverwrites[0][i].thisPermOverwrites);
                  };
                };
            })

      });
      });
      
} else if(veri.type === "voice") {
    if(!veri.name) return message.lineReplyNoMention(`Veritabanında belirtilen Kanal ID'sine ait hasarlı veriler bulundu! [isim]`);
    if(!veri.bitrate) return message.lineReplyNoMention(`Veritabanında belirtilen Kanal ID'sine ait hasarlı veriler bulundu! [bitrate]`);
    if(!veri.permissionOverwrites) return message.lineReplyNoMention(`Veritabanında belirtilen Kanal ID'sine ait hasarlı veriler bulundu! [izin]`);

    await message.lineReplyNoMention(`Veritabanında belirtilen Kanal ID'sine ait veri bulundu ve veriler aşağıda listelendi;
    
**Kanal Adı**: \`${veri.name}\`
**Kanal Kategorisi**: \`${veri.parentID}\`
**Kanal Limit**: \`${veri.rateLimitPerUser}\`
**Kanal BitRate**: \`${veri.bitrate}\``).then(msg => {
        msg.react("✅");
      
        const onay = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
      
        const collect = msg.createReactionCollector(onay, { time: 60000 });
        
        collect.on("collect", async r => {
          msg.delete().catch(err => console.log(`Mesaj silinemedi.`));
      
          message.guild.channels.create(veri.name, {type: veri.type}).then(channel => {
            message.lineReplyNoMention(` Kanal Kuruldu kanal izinleri ve yeri ayarlandı.`)      
            channel.setBitrate(veri.bitrate);
            channel.setUserLimit(veri.userLimit);
            channel.setParent(veri.parentID);
            channel.setPosition(veri.position);

            if(Object.keys(veri.permissionOverwrites[0]).length > 0) {
              for (let i = 0; i < Object.keys(veri.permissionOverwrites[0]).length; i++) {
                channel.createOverwrite(veri.permissionOverwrites[0][i].permission, veri.permissionOverwrites[0][i].thisPermOverwrites);
              };
            };
        })
      });
      });

}
};
