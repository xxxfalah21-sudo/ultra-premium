import { Telegraf } from "telegraf"
import express from "express"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

/* ================= CONFIG ================= */
const BOT_TOKEN = process.env.8545790505:AAF9zmut0HAmxVLzxk1LVOsQJQKgh0SLqXY
const ADMIN_ID = Number(process.env.8568466595)
const DOMAIN = process.env.DOMAIN
const PORT = process.env.PORT || 3000

/* ================= INIT ================= */
const bot = new Telegraf(BOT_TOKEN)
const app = express()

/* ================= DATABASE ================= */
const DB_FILE = "./database.json"
let db = { users: [], groups: [] }
if (fs.existsSync(DB_FILE)) db = JSON.parse(fs.readFileSync(DB_FILE))
const saveDB = () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))

/* ================= ASSETS ================= */
const animeImages = [
  "https://i.imgur.com/8Km9tLL.jpg",
  "https://i.imgur.com/Z7AzH2c.jpg",
  "https://i.imgur.com/Qr71crq.jpg",
  "https://i.imgur.com/0y8Ftya.jpg",
  "https://i.imgur.com/4AiXzf8.jpg",
  "https://i.imgur.com/2RM8b5Z.jpg"
]
const randomAnime = () => animeImages[Math.floor(Math.random()*animeImages.length)]

bot.use((ctx, next) => {
  if (ctx.from && !db.users.includes(ctx.from.id)) {
    db.users.push(ctx.from.id)
    saveDB()
  }
  return next()
})

bot.start((ctx) => {
  ctx.replyWithPhoto(
    randomAnime(),
    {
      caption: `✨ *ULTRA PREMIUM TELEGRAM BOT* ✨\n\n🤖 Fast • Secure • Stable\n💎 Anime • Premium UI`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🚀 MENU UTAMA", callback_data: "MENU" }],
          [{ text: "💎 PREMIUM", callback_data: "PREMIUM" }],
          [{ text: "🎴 RANDOM ANIME", callback_data: "ANIME" }]
        ]
      }
    }
  )
})

bot.action("ANIME", (ctx) => {
  ctx.replyWithPhoto(randomAnime())
})

app.use(express.json())
app.post(`/bot${BOT_TOKEN}`, (req, res) => bot.handleUpdate(req.body, res))
app.get("/", (req, res) => res.send("🤖 ULTRA PREMIUM BOT ACTIVE"))

app.listen(PORT, async () => {
  await bot.telegram.setWebhook(`${DOMAIN}/bot${BOT_TOKEN}`)
  console.log("🚀 Bot running")
})
