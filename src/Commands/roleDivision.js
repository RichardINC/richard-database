const { Discord, MessageEmbed } = require("discord.js");

  module.exports.config = {
  name: "dagit",
  aliases: ["dagit"],
  usage: "dagit ID",
  };

module.exports.execute = async(client, message, args) => {
  

if(message.author.id !== conf.owner) return;
let icerik = args[0];
if(!icerik) return message.lineReplyNoMention(`Hatalı Kullanim. \`Örnek: ${conf.prefix}dagit ID\``);
if(!Number(icerik)) return message.lineReplyNoMention(`Hatalı Kullanim. \`Örnek: ${conf.prefix}dagit ID\``);

let veri = guildRoles.cek(`${icerik}.${conf.guild}`);
if(!veri) return message.lineReplyNoMention(`Veritabanında belirtilen Rol ID'sine ait veri bulunamadı!`);
if(!veri.name) return message.lineReplyNoMention(`Veritabanında belirtilen Rol ID'sine ait hasarlı veriler bulundu! [isim]`);
if(!veri.color) return message.lineReplyNoMention(`Veritabanında belirtilen Rol ID'sine ait hasarlı veriler bulundu! [renk]`);
if(!veri.position) return message.lineReplyNoMention(`Veritabanında belirtilen Rol ID'sine ait hasarlı veriler bulundu! [yer]`);
if(!veri.permissions) return message.lineReplyNoMention(`Veritabanında belirtilen Rol ID'sine ait hasarlı veriler bulundu! [yetki]`);
if(!veri.members) return message.lineReplyNoMention(`Veritabanında belirtilen Rol ID'sine ait hasarlı veriler bulundu! [üye]`);
if(!veri.count) return message.lineReplyNoMention(`Veritabanında belirtilen Rol ID'sine ait hasarlı veriler bulundu! [miktar]`);
if(!veri.channelOverwrites) return message.lineReplyNoMention(`Veritabanında belirtilen Rol ID'sine ait hasarlı veriler bulundu! [kanal]`);

let ayirma;
if(veri.hoist === true) ayirma = "Açık";
if(veri.hoist === false) ayirma = "Kapalı";
await message.lineReplyNoMention(`Veritabanında belirtilen Rol ID'sine ait veri bulundu ve veriler aşağıda listelendi;

**Rolün Adı:** \`${veri.name}\` 
**Rolün Rengi:** \`${veri.color}\` 
**Rolün Ayırması:** \`${ayirma}\` 
**Rolün Yeri:** \`${veri.position}\`
**Rolün Üye Sayısı:** \`${veri.count}\``).then(msg => {
  msg.react("✅");

  const onay = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;

  const collect = msg.createReactionCollector(onay, { time: 60000 });
  
  collect.on("collect", async r => {
    msg.delete().catch(err => console.log(`Mesaj silinemedi.`));
    let yeniRol = await message.guild.roles.create({
      data: {
        name: veri.name,
        color: veri.color,
        hoist: veri.hoist,
        permissions: veri.permissions,
        position: veri.position,
        mentionable: veri.mentionable
      },
      reason: "Richard~ Backup =)"
    });
    await message.lineReplyNoMention(`Rol Kuruldu kanal izinleri ayarlanıyor.`)

    setTimeout(() => {
      let kanalPermVeri = veri.channelOverwrites;
      if (kanalPermVeri) kanalPermVeri.forEach((perm, index) => {
        let kanal = message.guild.channels.cache.get(perm.id);
        if (!kanal) return;
        setTimeout(() => {
          let yeniKanalPermVeri = {};
          perm.allow.forEach(p => {
            yeniKanalPermVeri[p] = true;
          });
          perm.deny.forEach(p => {
            yeniKanalPermVeri[p] = false;
          });
          kanal.createOverwrite(yeniRol, yeniKanalPermVeri).catch(console.error);
        }, index*5000);
      });
    }, 5000);
    await message.lineReplyNoMention(`Rolün kanal izinleri ayarlandı dağıtıma başlanıyor, Rol toplam **${veri.count}** kişiye verilecektir. (Gecikmeye göre değişiklik gösterebilir.)`)

    let roleMembers = veri.members;
    roleMembers.forEach((member, index) => {
      let uye = message.guild.members.cache.get(member);
      if (!uye || uye.roles.cache.has(yeniRol.id)) return;
      setTimeout(() => {
        uye.roles.add(yeniRol.id).catch(console.error);
      }, index*3000);
    });
  })
  
});
};
