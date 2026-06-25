require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an STI College Cubao assistant helping Grade 10 students choose Senior High School tracks and clusters under the DepEd Strengthened SHS Program.

You know about:
- Academic Track clusters: STEM, Business and Entrepreneurship, Arts/Social Science/Humanities, Sports/Health/Wellness
- TechPro Track clusters: ICT Support and Computer Programming, Hospitality and Tourism, Agri-Fishery Business and Food Innovation, Creative Arts and Design Technology, Aesthetic/Wellness/Human Care

Be friendly, accurate, concise, and student-friendly. Help students understand the difference between Academic (college prep) and TechPro (skills-based, TESDA certifications). Answer questions about choosing tracks, clusters, subjects, careers, and STI College Cubao enrollment when asked.`;

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        reply: "API key not configured. Add ANTHROPIC_API_KEY to your .env file.",
      });
    }

    const { message } = req.body;
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Sorry, something went wrong. Please try again." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`STI ProjectTrackFind running at http://localhost:${PORT}`);
});
