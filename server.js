const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.TORN_API_KEY;

app.use(express.static("public"));

// API endpoint for OC activity
app.get("/api/oc", async (req, res) => {
  try {
    const url = `https://api.torn.com/v2/faction/crimes?cat=completed&sort=DESC&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const lastOC = {};

    data.crimes.forEach(crime => {
      const time = crime.executed_at;
      crime.slots.forEach(slot => {
        const id = slot.user_id;
        const name = slot.user_name;
        if (!lastOC[id] || time > lastOC[id].time) {
          lastOC[id] = { name, time };
        }
      });
    });

    res.json(lastOC);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch OC data" });
  }
});

app.listen(PORT, () => {
  console.log(`Torn Control Center running on port ${PORT}`);
});
