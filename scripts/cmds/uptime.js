const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up","upt"],
    version: "1.0",
    author: "Vex_kshitiz",
    role: 0,
    shortDescription: {
      en: "Displays the bot's uptime."
    },
    longDescription: {
      en: "Find out how long the bot has been tirelessly serving you."
    },
    category: "owner",
    guide: {
      en: "Use {p}uptime to reveal the bot's operational duration."
    }
  },
  onStart: async function ({ api, event, args }) {
    try {

      const searchQueries = ["Makima cute pic", "Makima", "Chainsawman Couple", "Chainsawman Makima", "Makima anime latest pic" ];// add your query of image here.


      const randomQueryIndex = Math.floor(Math.random() * searchQueries.length);
      const searchQuery = searchQueries[randomQueryIndex];


      const apiUrl = `https://pin-two.vercel.app/pin?search=${encodeURIComponent(searchQuery)}`;


      const response = await axios.get(apiUrl);
      const imageLinks = response.data.result;


      const randomImageIndex = Math.floor(Math.random() * imageLinks.length);
      const imageUrl = imageLinks[randomImageIndex];


      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imagePath = path.join(__dirname, 'cache', `uptime_image.jpg`);
      await fs.outputFile(imagePath, imageResponse.data);


      const uptime = process.uptime();
      const seconds = Math.floor(uptime % 60);
      const minutes = Math.floor((uptime / 60) % 60);
      const hours = Math.floor((uptime / (60 * 60)) % 24);
      const days = Math.floor(uptime / (60 * 60 * 24));

      let uptimeString = `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
      if (days === 0) {
        uptimeString = `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
        if (hours === 0) {
          uptimeString = `${minutes} minutes, and ${seconds} seconds`;
          if (minutes === 0) {
            uptimeString = `${seconds} seconds`;
          }
        }
      }


      const message = `𝐇𝐞𝐥𝐥𝐨 𝐌𝐚𝐬𝐭𝐞𝐫👑, 𝐭𝐡𝐞 𝐛𝐨𝐭🤖 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐫𝐮𝐧𝐧𝐢𝐧𝐠🚀 𝐟𝐨𝐫:\n${uptimeString}`;
      const imageStream = fs.createReadStream(imagePath);

      await api.sendMessage({
        body: message,
        attachment: imageStream
      }, event.threadID, event.messageID);


      await fs.unlink(imagePath);
    } catch (error) {
      console.error(error);
      return api.sendMessage(`An error occurred.`, event.threadID, event.messageID);
    }
  }
};
