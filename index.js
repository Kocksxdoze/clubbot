const { Client, Intents } = require('discord.js');
const { token, prefix } = require('./config.json');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice'); // Добавлен импорт joinVoiceChannel
const prism = require('prism-media');
const ffmpeg = require('ffmpeg-static');
const ffmpegPath = ffmpeg.path;
const ytdl = require('ytdl-core')

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

bot.once('ready', () => {
    console.log("Готов");
    
    bot.user.setPresence({
        status:'idle'
    });
});





bot.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "play") {

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            message.channel.send("Вы должны быть в голосовом канале, чтобы использовать эту команду.");
            return;
        }
    

        const url = args[0];
        if (!url) {
            message.channel.send("Пожалуйста, укажите URL-адрес аудиофайла.");
            return;
        }
        const stream = ytdl(url, { filter: 'audioonly' });

        const player = createAudioPlayer();
        const resource = createAudioResource(stream);
    
        message.channel.send("Воспроизвожу!");
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
    

        player.play(resource);
        connection.subscribe(player);
    }
    else if(command === "stop"){
    const connection = getVoiceConnection(message.guild.id);
    if (!connection) {
        message.channel.send("Бот не находится в голосовом канале.");
        return;
    }

    connection.destroy();
    message.channel.send("Бот был отключен от голосового канала.");
    }

 
});

bot.login(process.env.token);
// bot.login(token);
