// index.js

const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

const messageMap = new Map();

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== process.env.CHANNEL_ID) return;

  // نرسل صورة الفاصل بعد 3 ثواني
  setTimeout(async () => {
    const divider = await message.channel.send({
      files: ['./assets/feelings-divider.png']
    });

    // نخزن معرف رسالة العضو وربطها مع الفاصل
    messageMap.set(message.id, divider.id);
  }, 3000);
});

client.on('messageDelete', async (deletedMessage) => {
  // نتحقق إذا الرسالة المحذوفة لها فاصل مرتبط
  if (messageMap.has(deletedMessage.id)) {
    const dividerId = messageMap.get(deletedMessage.id);
    try {
      const msg = await deletedMessage.channel.messages.fetch(dividerId);
      await msg.delete();
      messageMap.delete(deletedMessage.id); // نحذف الربط من الذاكرة
    } catch (err) {
      console.error('خطأ في حذف الفاصل:', err.message);
    }
  }
});


client.login(process.env.TOKEN);


const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(3000, () => {
  console.log("Feelings Bot is live on port 3000");
});
