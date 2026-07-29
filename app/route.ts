import homeHtml from "./static/index.html?raw";

const htmlHeaders = {
  "content-type": "text/html; charset=utf-8",
};

export async function GET() {
  return new Response(homeHtml, { headers: htmlHeaders });
}
