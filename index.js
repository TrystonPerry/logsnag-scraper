import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

let hasMore = true;
let cursor = null;

while (hasMore) {
  const input = {
    0: {
      json: {
        projectId: process.env.PROJECT_ID,
        limit: 50,
        cursor,
      },
    },
  };

  const res = await fetch(
    `https://services.logsnag.com/trpc/v1.project.feed.feed?batch=1&input=${encodeURIComponent(
      JSON.stringify(input)
    )}`,
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        authorization: process.env.AUTHORIZATION,
        "content-type": "application/json",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-timezone": "America/Los_Angeles",
      },
      referrer: "https://app.logsnag.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  );

  const data = await res.json();

  const { hasNext, logs, nextCursor } = data[0].result.data.json;

  // If first request, write collumn names
  if (cursor === null) {
    await fs.writeFile("logs.csv", `${Object.keys(logs[0]).join(",")}\n`);
  }

  hasMore = hasNext;
  cursor = nextCursor;

  const lines = [];

  for (const log of logs) {
    const { id, userId, event, description, timestamp } = log;
    lines.push(`${id},${userId},${event},${description},${timestamp}`);
  }

  // Trottle to avoid spamming Logsnag API
  await new Promise((r) => setTimeout(r, 300));

  // Append lines to logs.csv
  await fs.appendFile("logs.csv", lines.join("\n"));

  console.log(`Parsed ${lines.length} logs at cursor: ${cursor}`);
}
