export default async function handler(req, res) {
  const GIST_ID = process.env.GIST_ID;
  const GITHUB_PAT = process.env.GITHUB_PAT;

  try {
    const resp = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        "Authorization": `Bearer ${GITHUB_PAT}`,
        "Accept": "application/vnd.github+json"
      }
    });
    if (!resp.ok) throw new Error(`github api error ${resp.status}`);
    const gist = await resp.json();
    const file = Object.values(gist.files)[0];
    const list = JSON.parse(file.content);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).json({ ok: true, data: list });
  } catch (e) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({ ok: false, error: e.message });
  }
}
