import { readFileSync } from "fs";

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      // On-the-fly build for development
      const result = await Bun.build({
        entrypoints: ["./src/index.ts"],
        target: "browser",
      });

      if (!result.success) {
        return new Response("Build Error: " + result.logs.map(l => l.message).join("\n"), { status: 500 });
      }

      const js = await result.outputs[0].text();
      const css = readFileSync("./src/styles.css", "utf-8");
      const html = readFileSync("./src/template.html", "utf-8")
        .replace("/* INLINE_CSS */", css)
        .replace("/* INLINE_JS */", js);

      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🚀 Dev server: http://localhost:${server.port}`);
console.log(`Watching for changes...`);
