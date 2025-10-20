
// © 2025 KyuuRzy. All Rights Reserved.
// respect the work, don’t just copy-paste.

const fs = require('fs')

const config = {
    owner: "6285182389210",
    botNumber: "6285654120472",
    setPair: "XGTIB123",
    thumbUrl: "https://telegra.ph/file/cb8318a5349c8145b0444.png",
    session: "sessions",
    status: {
        public: true,
        terminal: true,
        reactsw: true
    },
    message: {
        owner: "no, this is for owners only",
        group: "this is for groups only",
        admin: "this command is for admin only",
        private: "this is specifically for private chat"
    },
    settings: {
        title: "GxoBot Ai",
        packname: 'GxoProject By Xgtib',
        description: "this script was created by Xgtib",
        author: 'https://www.github.com/gyrostops',
        footer: "𝗍𝖾𝗅𝖾𝗀𝗋𝖺𝗆: @xjzvq"
    },
    newsletter: {
        name: "GxoProject",
        id: "120363401606948980@newsletter"
    },
    socialMedia: {
        YouTube: "https://youtube.com/@xgtibxcyb",
        GitHub: "https://github.com/gyrostops",
        Telegram: "https://t.me/xjzvq",
        ChannelWA: "https://whatsapp.com/channel/0029Vb6FJdyJ3juuTb8OdJ0o"
    },
    api: {
        baseurl: "https://zephrine.live/",
        apikey: "kyuurzy" // berlaku sampai tanggal 1 oktober
    },
    sticker: {
        packname: "GxoProject Team",
        author: "- By Xgtib"
    }
}

module.exports = config;

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
