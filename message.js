
// © 2025 KyuuRzy. All Rights Reserved.
// respect the work, don’t just copy-paste.

const config = require('./settings/config');
const fs = require('fs');
const crypto  = require("crypto")
const path = require("path")
const os = require('os');
const chalk = require("chalk")
const fetch = require("node-fetch")
const { exec } = require('child_process');
const { getContentType } = require("@whiskeysockets/baileys");
const { dechtml } = require('./library/function');       
const { tempfiles } = require("./library/uploader")
const { fquoted } = require('./library/quoted')     
const Api = require('./library/Api')

const image = fs.readFileSync('./thumbnail/image.jpg')
const docu = fs.readFileSync('./thumbnail/document.jpg')

module.exports = sock = async (sock, m, chatUpdate, store) => {
    try {
        const body = (
            m.mtype === "conversation" ? m.message.conversation :
            m.mtype === "imageMessage" ? m.message.imageMessage.caption :
            m.mtype === "videoMessage" ? m.message.videoMessage.caption :
            m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
            m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
            m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
            m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
            m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
            m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId :
            m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId ||
            m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : ""
        );
        
        const sender = m.key.fromMe ? sock.user.id.split(":")[0] + "@s.whatsapp.net" ||
              sock.user.id : m.key.participant || m.key.remoteJid;
        
        const senderNumber = sender.split('@')[0];
        const budy = (typeof m.text === 'string' ? m.text : '');
        const prefa = ["", "!", ".", ",", "🐤", "🗿"];

        const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
        const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
        const from = m.key.remoteJid;
        const isGroup = from.endsWith("@g.us");
        const botNumber = await sock.decodeJid(sock.user.id);
        const isBot = botNumber.includes(senderNumber)
        
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const command2 = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1);
        const pushname = m.pushName || "No Name";
        const text = q = args.join(" ");
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';
        const qmsg = (quoted.msg || quoted);
        const isMedia = /image|video|sticker|audio/.test(mime);
        const groupMetadata = m?.isGroup ? await sock.groupMetadata(m.chat).catch(() => ({})) : {};
        const groupName = m?.isGroup ? groupMetadata.subject || '' : '';
        const participants = m?.isGroup ? groupMetadata.participants?.map(p => {
            let admin = null;
            if (p.admin === 'superadmin') admin = 'superadmin';
            else if (p.admin === 'admin') admin = 'admin';
            return {
                id: p.id || null,
                jid: p.jid || null,
                admin,
                full: p
            };
        }) || []: [];
        const groupOwner = m?.isGroup ? participants.find(p => p.admin === 'superadmin')?.jid || '' : '';
        const groupAdmins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.jid || p.id);
        const isBotAdmins = m?.isGroup ? groupAdmins.includes(botNumber) : false;
        const isAdmins = m?.isGroup ? groupAdmins.includes(m.sender) : false;
        const isGroupOwner = m?.isGroup ? groupOwner === m.sender : false;
        
        if (isCmd) {
            console.log(chalk.hex("#6c5ce7")("# New Message"))
            console.log(`- Tanggal  : ${chalk.white(new Date().toLocaleString())}`)
            console.log(`- Pesan    : ${chalk.white(command)}`)
            console.log(`- Pengirim : ${chalk.white(pushname)}`)
            console.log(`- JID      : ${chalk.white(senderNumber)}`)
            console.log(`ㅤ\n`)
        }
        
        async function reply(text) {
            sock.sendMessage(m.chat, {
                text: text,
                contextInfo: {
                    mentionedJid: [sender],
                    externalAdReply: {
                        title: config.settings.title,
                        body: config.settings.description,
                        thumbnailUrl: config.thumbUrl,
                        sourceUrl: config.socialMedia.Telegram,
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted: fquoted.channel })
        }

        switch (command) {
            case "menu":{
                let menu = `𝗁𝗂 ${pushname}.`
                await sock.sendMessage(m.chat, {
                    interactiveMessage: {
                        title: menu,
                        footer: config.settings.footer,
                        document: fs.readFileSync("./package.json"),
                        mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        fileName: "@𝗌𝗍𝗏𝗇𝗇𝗏𝗌",
                        jpegThumbnail: docu,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            forwardingScore: 1,
                            isForwarded: false,
                        },
                        externalAdReply: {
                            title: "shenń Bot",
                            body: "anu team",
                            mediaType: 3,
                            thumbnailUrl: config.thumbUrl,
                            mediaUrl: "X",
                            sourceUrl: "https://t.me/stvnnvs",
                            showAdAttribution: true,
                            renderLargerThumbnail: false         
                        },
                        nativeFlowMessage: {
                            messageParamsJson: JSON.stringify({
                                limited_time_offer: {
                                    text: "𝗄𝗒𝗎𝗎 𝗌𝗍𝗂𝗅𝗅 𝗅𝖾𝖺𝗋𝗇𝗂𝗇𝗀",
                                    url: "https://t.me/kiuurmine",
                                    copy_code: "𝗄𝗒𝗎𝗎 𝗌𝗍𝗂𝗅𝗅 𝗅𝖾𝖺𝗋𝗇𝗂𝗇𝗀",
                                    expiration_time: Date.now() * 999
                                },
                                bottom_sheet: {
                                    in_thread_buttons_limit: 2,
                                    divider_indices: [1, 2, 3, 4, 5, 999],
                                    list_title: "ㅤ",
                                    button_title: "ㅤ"
                                },
                                tap_target_configuration: {
                                    title: " X ",
                                    description: "bomboclard",
                                    canonical_url: "https://t.me/stvnns",
                                    domain: "https://shop.example.com",
                                    button_index: 0
                                }
                            }),
                            buttons: [
                                {
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({ 
                                        has_multiple_buttons: true 
                                    })
                                },
                                {
                                    name: "cta_url",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "Telegram",
                                        url: "https://t.me/stvnnvs",
                                        merchant_url: "https://t.me/stvnnvs"
                                    })
                                },
                                {
                                    name: "cta_copy",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "Copy Code",
                                        id: "123456789",
                                        copy_code: "ABC123XYZ"
                                    })
                                }
                            ]
                        }
                    }
                }, { quoted: fquoted.channel });
            }
            break
            case "runtime": {
                let uptime = process.uptime();
                let hours = Math.floor(uptime / 3600);
                let minutes = Math.floor((uptime % 3600) / 60);
                let seconds = Math.floor(uptime % 60);
                
                await sock.sendMessage(m.chat, { 
                    pollResultMessage: { 
                        name: "Runtime Info", 
                        pollVotes: [
                            {
                                optionName: "Runtime (Hours)",
                                optionVoteCount: hours
                            },
                            {
                                optionName: "Runtime (Minutes)",
                                optionVoteCount: minutes
                            },
                            {
                                optionName: "Runtime (Seconds)",
                                optionVoteCount: seconds
                            }
                        ] 
                    } 
                }, { quoted: fquoted.channel });
            }
            break;
            case "script":
            case "sc": {
                await sock.sendMessage(m.chat,{
                    productMessage: {
                        title: "kiruku-wabot !",
                        description: "Ini adalah deskripsi produk",
                        thumbnail: { url: "https://files.catbox.moe/63uln3" },
                        productId: "PROD001",
                        retailerId: "RETAIL001",
                        url: "https://github.com/kiuur/kiruku-wabot",
                        body: "the script is here",
                        footer: config.settings.footer,
                        priceAmount1000: 777,
                        currencyCode: "IDR",
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "GitHub",
                                    url: "https://github.com/kiuur/kiruku-wabot"
                                })
                            }
                        ]
                    }
                }, { quoted: fquoted.channel });
            }
            break;
            case "info": {
                const totalMem = os.totalmem();
                const freeMem = os.freemem();
                const usedMem = totalMem - freeMem;
                
                const usedGB = Math.floor(usedMem / 1024 / 1024 / 1024);
                const totalGB = Math.floor(totalMem / 1024 / 1024 / 1024);
                
                let timestamp = Date.now();
                let latensi = Date.now() - timestamp;

                await sock.sendMessage(m.chat, { 
                    pollResultMessage: { 
                        name: "System Info", 
                        pollVotes: [
                            {
                                optionName: "Speed (ms)",
                                optionVoteCount: Math.max(1, Math.floor(latensi)) 
                            },
                            {
                                optionName: "RAM Used (GB)",
                                optionVoteCount: usedGB
                            },
                            {
                                optionName: "Total RAM (GB)",
                                optionVoteCount: totalGB
                            }
                        ] 
                    } 
                }, { quoted: fquoted.channel });
            }
            break
            case "toguraa":
            case "togura": {
                if (!m.quoted || m.quoted.mtype !== "imageMessage") return reply(`reply image dengan caption ${prefix + command}`)
                let ppk = await sock.downloadMediaMessage(m.quoted)
                let url = await tempfiles(ppk)
                
                let json = await Api.get("api/generator/guraa", {
                    url,
                    apikey: config.api.apikey
                })
                
                let hasil = json.result
                let res = await fetch(hasil)
                let arrayBuffer = await res.arrayBuffer()
                let buff = Buffer.from(arrayBuffer)

                await sock.sendImageAsSticker(m.chat, buff, fquoted.channel, {
                    packname: config.sticker.packname,
                    author: config.sticker.author
                })
            }
            break
            case "ai":
            case "openai": {
                if (!text) return reply(`*ex:* ${prefix + command} hai, tanggal berapa sekarang?`)             
                let query = text
                let json = await Api.get("api/ai/venice", {
                    query,
                    apikey: config.api.apikey
                })
                
                let hasil = json.result
                return reply(hasil)
            }
            break 
            case "cekban": {
                if (!args[0]) return reply(`*ex:* ${prefix + command} 62xxxx`)
                
                let number = args[0]
                let json = await Api.get("api/generator/cekbann", {
                    number,
                    apikey: config.api.apikey
                })
                
                let bannedStatus = json.result.isBanned ? "banned" : "active"
                let needOfficial = json.result.isNeedOfficialWa ? "yes" : "no"
                let text = `*📱 cekbann result*
• Number: ${json.result.number}
• Status: ${bannedStatus}
• Need Official WA: ${needOfficial}`
                if (json.result.isBanned && json.result.data) {
                    text += `
• Violation Type: ${json.result.data.violation_type}
• Appeal Token: ${json.result.data.appeal_token ? "available" : "none"}`
                }
                return reply(text)
            }
            break
            case "mesinfo": {
                if (!m.quoted) return reply(`reply pesan dengan caption ${prefix + command}`);
             
                const type = m.quoted.mtype;
                const id = m.quoted.id;
                reply(`Pesan yang di-reply memiliki:\n- Tipe pesan: *${type}*\n- ID pesan: *${id}*`);
            }
            break;
            case "dechtml": {
                if (!m.quoted || m.quoted.mtype !== "documentMessage") return reply(`reply file html dengan caption ${prefix + command}`)
                
                let buff = await sock.downloadMediaMessage(m.quoted, "buffer", {}, {})
                let raw = buff.toString("utf8")
                
                if (raw.includes("</html>") && !/const chunks|splitKey|splitIv|atob\(/.test(raw)) return reply(`file ini tidak terenkripsi`)
                
                let hasil = await dechtml(buff)
                let text = hasil.toString("utf8")
                
                await sock.sendMessage(m.chat, { 
                    document: Buffer.from(text), 
                    mimetype: "text/html", 
                    fileName: "result.html" 
                }, { quoted: fquoted.channel })
            }
            break
            case "insp": {
                if (!text && !m.quoted) return reply(`*reply:* ${prefix + command}`);
                let quotedType = m.quoted?.mtype || '';
                let penis = JSON.stringify({ [quotedType]: m.quoted }, null, 2);
                const acak = `insp-${crypto.randomBytes(6).toString('hex')}.json`;
                
                await sock.sendMessage(m.chat, {
                    document: Buffer.from(penis),
                    fileName: acak,
                    mimetype: "application/json"
                }, { quoted: fquoted.channel })
            }
            break
            case 'tagall':{
                const textMessage = args.join(" ") || "nothing";
                let teks = `tagall message :\n> *${textMessage}*\n\n`;
                const groupMetadata = await sock.groupMetadata(m.chat);
                const participants = groupMetadata.participants;
                for (let mem of participants) {
                    teks += `@${mem.id.split("@")[0]}\n`;
                }

                sock.sendMessage(m.chat, {
                    text: teks,
                    mentions: participants.map((a) => a.id)
                }, { quoted: fquoted.channel });
            }
            break
            case "ex":
            case "exec": {
                if (!budy.startsWith(".exec")) return;
                
                const { exec } = require("child_process");
                const args = budy.trim().split(' ').slice(1).join(' ');
                if (!args) return reply(`*ex:* ${prefix + command} ls`);
                exec(args, (err, stdout) => {
                    if (err) return reply(String(err));
                    if (stdout) return reply(stdout);
                });
            }
            break;
            case "ev":
            case "eval": {
                if (!budy.startsWith(".eval")) return;
                
                const args = budy.trim().split(' ').slice(1).join(' ');
                if (!args) return reply(`*ex:* ${prefix + command} m.chat`);
                let teks;
                try {
                    teks = await eval(`(async () => { ${args.startsWith("return") ? "" : "return"} ${args} })()`);
                } catch (e) {
                    teks = e;
                } finally {
                    await reply(require('util').format(teks));
                }
            }
            break;
            default:
        }
    } catch (err) {
        console.log(require("util").format(err));
    }
}

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
