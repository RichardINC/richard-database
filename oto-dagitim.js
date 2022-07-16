const { Discord, MessageEmbed } = require("discord.js");


module.exports = async (role) => {

  let yeniRol = await role.guild.roles.create({
    data:{
      name: role.name,
      position: role.rawPosition,
      permissions: role.permissions,
      mentionable: role.mentionable,
      hoist: role.hoist,
      color: role.hexColor
    }
  })

  let veri = guildRoles.cek(`${role.id}.${conf.guild}`);
  client.guilds.cache.get(conf.guild).channels.cache.get(conf.log).send(`<@&${yeniRol.id}> rolü silindi ve yeniden kuruldu, Rol toplam **${veri.count || 0}** kişiye verilecektir. (Gecikmeye göre değişiklik gösterebilir.)`)
  let roleMembers = veri.members;
  roleMembers.forEach((member, index) => {
    let uye = role.guild.members.cache.get(member);
    if (!uye || uye.roles.cache.has(yeniRol.id)) return;
    setTimeout(() => {
      uye.roles.add(yeniRol.id).catch(console.error);
    }, index*3000);
  })
}


module.exports.config = {

  name: "roleDelete",
}
