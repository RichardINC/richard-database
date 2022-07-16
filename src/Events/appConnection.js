const { Discord, MessageEmbed } = require("discord.js");


module.exports = async () => {

  client.user.setPresence({ activity: { name: conf.activity }, status: "IDLE" });

}

module.exports.config = {

  name: "ready",
}
