import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

async function build() {
  console.log("🚀 Starting build...");

  // 1. Bundle TypeScript to JS
  const result = await Bun.build({
    entrypoints: ["./src/index.ts"],
    minify: true,
    target: "browser",
  });

  if (!result.success) {
    console.error("❌ Build failed:", result.logs);
    process.exit(1);
  }

  const jsCode = await result.outputs[0].text();

  // 2. Read CSS
  const css = readFileSync("./src/styles.css", "utf-8");

  // 3. Read HTML template
  const htmlTemplate = readFileSync("./src/template.html", "utf-8");

  // 4. Inline everything into single HTML
  const finalHtml = htmlTemplate
    .replace("/* INLINE_CSS */", css)
    .replace("/* INLINE_JS */", jsCode);

  // 5. Write output
  if (!existsSync("./dist")) {
    mkdirSync("./dist", { recursive: true });
  }
  writeFileSync("./dist/index.html", finalHtml);

  console.log("✅ Built dist/index.html");
}

build();
