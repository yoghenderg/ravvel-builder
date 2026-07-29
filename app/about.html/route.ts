import aboutHtml from "../static/about.html?raw";

const htmlHeaders = {
  "content-type": "text/html; charset=utf-8",
};

export async function GET() {
  return new Response(aboutHtml, { headers: htmlHeaders });
}
