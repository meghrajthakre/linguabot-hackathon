import crypto from "crypto";

export function generatePublicKey() {
  return "lb_" + crypto.randomBytes(24).toString("hex");
}