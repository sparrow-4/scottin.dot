// vercel-lightningcss-fix.js
const { execSync } = require("child_process");

try {
  console.log("⚡ Fixing lightningcss for Linux (Vercel build)...");
  execSync("npm rebuild lightningcss --force", { stdio: "inherit" });
  console.log("✅ lightningcss rebuild complete!");
} catch (err) {
  console.error("⚠️ lightningcss rebuild failed:", err);
}
