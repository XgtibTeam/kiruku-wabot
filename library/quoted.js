
// © 2025 KyuuRzy. All Rights Reserved.
// respect the work, don’t just copy-paste.

const fs = require('fs')

const fquoted = {
    channel: {
        key: {
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "13135550202@s.whatsapp.net"
        },
        message: {
            newsletterAdminInviteMessage: {
                newsletterJid: "120363422203623591@newsletter",
                newsletterName: " X ",
                caption: "𝘬𝘪𝘳𝘶𝘬𝘶 𝘴𝘪𝘮𝘱𝘭𝘦 𝘸𝘢𝘣𝘰𝘵 ϟ",
                inviteExpiration: "1757494779"
            }
        }
    }
};

module.exports = { fquoted };

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})

