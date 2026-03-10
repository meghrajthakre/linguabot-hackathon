import Bot from "../models/Bot.model.js";

export default async function publicAuth(req, res, next) {
  try {
    const publicKey =
      req.headers["x-public-key"] ||
      req.body.publicKey;

    if (!publicKey) {
      return res.status(401).json({ message: "Public key missing" });
    }

    const bot = await Bot.findOne({
      publicKey,
      isActive: true,
    });

    if (!bot) {
      return res.status(404).json({ message: "Invalid public key" });
    }

    req.bot = bot;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Auth failed" });
  }
}