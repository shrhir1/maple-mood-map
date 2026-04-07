# 🍄 Mood Mapping
### AI Mental Wellness Companion | DiamondHacks 2026 — Best Mobile Hack Winner

Mood Mapping is an AI-powered mental wellness web app featuring **Maple**, a supportive mushroom companion that guides users through daily emotion check-ins and connects them to real professional help when they need it most.

---

## 🌿 Live Demo
[Try Mood Mapping →](https://maple-mood-map.lovable.app/)

---

## ✨ Features

- **Daily emotion check-in** — 5 emotions (Happy, Sad, Anxious, Angry, Tired) with a 1–10 severity slider
- **Claude AI recommendations** — personalized lifestyle suggestions generated in real time based on emotion type and severity level
- **Automatic escalation** — severity 8+ triggers Maple's live support chat powered by the Fetch.ai ASI:One agent
- **Live crisis support chat** — Fetch.ai ASI:One agent connects high-severity users to real local mental health resources and therapists
- **Mood pattern detection** — sliding-window analysis across 7 sessions detects recurring high-severity emotions and surfaces gentle interventions
- **Gamification layer** — XP system, daily streak counter, and mood history visualization to drive consistent engagement
- **Find Services tab** — always-accessible mental health resources including UCSD Counseling, 211 San Diego, and NAMI San Diego

---

## 🧠 How It Works

```
User selects emotion + severity
        ↓
Claude API analyzes input
        ↓
Severity 1–7 → Personalized lifestyle recommendations
Severity 8+  → Escalation banner + Fetch.ai live support chat
        ↓
Session saved to localStorage
        ↓
Pattern detection runs across last 7 sessions
        ↓
3+ high-severity same emotion → Gentle intervention triggered
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Lovable, Nunito font |
| AI Recommendations | Anthropic Claude API (claude-sonnet-4) |
| Live Support Agent | Fetch.ai ASI:One (ASI1 API) |
| Mood Pattern Tracking | localStorage, sliding-window analysis |
| Styling | Custom CSS, Headspace-inspired design |
| Deployment | Lovable (live URL above) |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/shrhir1/maple-mood-map.git
cd maple-mood-map

# Install dependencies
npm install

# Add your API keys to .env
VITE_ANTHROPIC_API_KEY=your_claude_api_key
VITE_ASI1_API_KEY=your_fetch_ai_key

# Run locally
npm run dev
```

> ⚠️ Never commit your `.env` file. Make sure `.env` is in your `.gitignore`.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── MoodMapping.tsx        # Main app component, screen flow
│   ├── MapleSupportChat.tsx   # Fetch.ai ASI:One chat integration
│   └── StoryBookBackground.tsx # Animated background
├── lib/
│   └── claude.ts              # Claude API integration + system prompt
└── main.tsx
```

---

## 🌱 What's Next

- **Perplexity API** — live therapist search by location and insurance in real time
- **Apple HealthKit** — passive mood detection using heart rate and sleep data
- **Maple evolves** — mascot appearance grows with your streak
- **Push notifications** — Fetch.ai agent nudges you if you haven't checked in for 2+ days

---

## 🏆 Awards

- **Best Mobile Hack** — DiamondHacks 2026, UC San Diego

---

## 👥 Team

- **Anush Harish**
- **Shreya Hiremath**

---

## 📄 License

MIT License — feel free to build on this.

---

*Built with 🍄 and zero sleep at DiamondHacks 2026*
