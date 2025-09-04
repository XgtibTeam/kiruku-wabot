
// © 2025 KyuuRzy. All Rights Reserved.
// respect the work, don’t just copy-paste.

const axios = require('axios')
const moment = require('moment-timezone')
const { sizeFormatter } = require('human-readable')
const util = require('util')
const { read, MIME_JPEG, jimp } = require('jimp')
const vm = require("vm")
const CryptoJS = require("crypto-js")

const unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000)

const resize = async (image, width, height) => {
    let oyy = await jimp.read(image)
    let kiyomasa = await oyy.resize(width, height).getBufferAsync(jimp.MIME_JPEG)
    return kiyomasa
}

const generateMessageTag = (epoch) => {
    let tag = unixTimestampSeconds().toString();
    if (epoch)
        tag += '.--' + epoch;
    return tag;
}

const processTime = (timestamp, now) => {
    return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

const clockString = (ms) => {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

const runtime = function(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

const getTime = (format, date) => {
    if (date) {
        return moment(date).locale('id').format(format)
    } else {
        return moment.tz('Asia/Jakarta').locale('id').format(format)
    }
}

const formatDate = (n, locale = 'id') => {
    let d = new Date(n)
    return d.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    })
}

const tanggal = (numer) => {
    const myMonths = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];
    var tgl = new Date(numer);
    var day = tgl.getDate()
    var bulan = tgl.getMonth()
    var thisDay = tgl.getDay();
    thisDay = myDays[thisDay];
    var yy = tgl.getYear()
    var year = (yy < 1000) ? yy + 1900 : yy;
    
    return `${thisDay}, ${day} - ${myMonths[bulan]} - ${year}`
}

const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

const getBuffer = async (url, options) => {
    try {
        options = options || {}
        const res = await axios({
            method: "get",
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        })
        return res.data
    } catch (err) {
        return err
    }
}

const fetchJson = async (url, options) => {
    try {
        options = options || {}
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}

const formatSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};

const formatp = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
})

const bytesToSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const getSizeMedia = (path) => {
    return new Promise((resolve, reject) => {
        if (/http/.test(path)) {
            axios.get(path)
                .then((res) => {
                    let length = parseInt(res.headers['content-length'])
                    let size = bytesToSize(length, 3)
                    if (!isNaN(length)) resolve(size)
                })
                .catch(reject)
        } else if (Buffer.isBuffer(path)) {
            let length = Buffer.byteLength(path)
            let size = bytesToSize(length, 3)
            if (!isNaN(length)) resolve(size)
        } else {
            reject('Invalid path or buffer')
        }
    })
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

const jsonformat = (string) => {
    return JSON.stringify(string, null, 2)
}

const format = (...args) => {
    return util.format(...args)
}

const parseMention = (text = '') => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}

const getGroupAdmins = (participants) => {
    let admins = []
    for (let i of participants) {
        i.admin === "superadmin" ? admins.push(i.id) : i.admin === "admin" ? admins.push(i.id) : ''
    }
    return admins || []
}

const generateProfilePicture = async (buffer) => {
    const jimp = require('jimp')
    const image = await jimp.read(buffer)
    const min = image.getWidth()
    const max = image.getHeight()
    const cropped = image.crop(0, 0, min, max)
    return {
        img: await cropped.scaleToFit(720, 720).getBufferAsync(jimp.MIME_JPEG),
        preview: await cropped.scaleToFit(720, 720).getBufferAsync(jimp.MIME_JPEG)
    }
}

const dechtml = async (buffer) => {
  const html = buffer.toString("utf8")

  if (/const chunks =/.test(html)) {
    const c = html.match(/const chunks = (\[[\s\S]*?\]);/)[1]
    const k = html.match(/const splitKey = (\[[\s\S]*?\]);/)[1]
    const v = html.match(/const splitIv = (\[[\s\S]*?\]);/)[1]

    const s = {}
    vm.createContext(s)
    vm.runInContext(`chunks=${c}`, s)
    vm.runInContext(`splitKey=${k}`, s)
    vm.runInContext(`splitIv=${v}`, s)

    const keyArr = s.splitKey[0].concat(s.splitKey[1]).map(Number)
    const ivArr = s.splitIv[0].concat(s.splitIv[1]).map(Number)
    const key = CryptoJS.lib.WordArray.create(new Uint8Array(keyArr))
    const iv = CryptoJS.lib.WordArray.create(new Uint8Array(ivArr))

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(s.chunks.join("")) },
      key,
      { iv }
    )

    const words = decrypted.words
    const sigBytes = decrypted.sigBytes
    const out = Buffer.alloc(sigBytes)
    for (let i = 0; i < sigBytes; i++) {
      out[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
    }
    return out
  }

  if (/atob\(/.test(html)) {
    const base64 = html.match(/atob\(["'`]([^"'`]+)["'`]\)/)[1]
    const decoded = Buffer.from(base64, "base64")

    let text
    try {
      const bin = decoded.toString("binary")
      text = decodeURIComponent(unescape(bin))
    } catch {
      text = decoded.toString("utf8")
    }

    return Buffer.from(text, "utf8")
  }

  return Buffer.from(html, "utf8")
}

module.exports = {
    unixTimestampSeconds,
    resize,
    generateMessageTag,
    processTime,
    getRandom,
    getBuffer,
    formatSize,
    fetchJson,
    runtime,
    clockString,
    sleep,
    isUrl,
    getTime,
    formatDate,
    tanggal,
    formatp,
    jsonformat,
    format,
    generateProfilePicture,
    bytesToSize,
    getSizeMedia,
    parseMention,
    getGroupAdmins,
    dechtml
}