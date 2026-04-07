# Mood Mapping with Maple

## Inspiration
Emotional intelligence and mood awareness are often overlooked in our daily lives. We were inspired by the idea that tracking your emotions not just when you're in crisis, but every day can reveal powerful patterns about your mental health. Many people struggle to recognize when they need help, and even more don't know where to turn when they do. We wanted to build a companion that motivates you to check in with with yourself and gently guides you toward support when things get hard.

## What it does
Mood Mapping is an AI-powered mental wellness web app featuring Maple, a supportive mushroom mascot. Users check in daily by selecting one of five emotions (Happy, Sad, Anxious, Angry, Tired) and rating their severity from 1–10. Claude AI analyzes the input and generates personalized lifestyle recommendations tailored to the specific emotion and severity level. For high severity scores (7+), Maple opens a live chat powered by the Fetch.ai ASI:One, in which the agent that provides real local mental health resources and therapist support. The app also tracks mood history over time, detecting patterns like repeated high-severity check-ins and surfacing gentle nudges through a Fetch.ai agent. A gamification layer (XP, streaks, mood history) keeps users engaged and coming back daily.

## How we built it
Frontend: Built with React using Lovable as our AI-powered development platform, designed with a  warm aesthetic and Nunito font
Mascot & Emotions Characters: Maple is a custom mushroom character designed and built on figma which was integrated as an image asset with CSS animations (floating, bouncing, tilting) across all 4 screens. The 5 emotions were also build through figma and we decided to make them shaped like balloons to represent that emotions can be temporary.
Claude API: Powers the core recommendation engine, takes emotion + severity as input and returns a structured JSON response with a personalized message, 3 tailored recommendations, and an escalation flag for high severity
Fetch.ai ASI:One: Our Maple Support Chat is powered by the ASI1 API, giving users a real conversational agent that provides warm support and connects them to local mental health resources
Mood Pattern Tracker: Built using localStorage to store every check-in and detect patterns across sessions
Gamification: XP system, daily streak counter, and mood history pills on the done screen

## Challenges we ran into
Integrating the Fetch.ai agent as a real in-app chatbot rather than just a link — we had to debug CORS issues, wrong API endpoints, and figure out the correct ASI1 API format Getting Claude to return consistent raw JSON without markdown code fences — solved by explicitly instructing the model in the system prompt and stripping backticks before parsing

## Accomplishments that we're proud of
Building a fully functional, polished mental wellness app in under 24 hours
Maple feels genuinely alive — the animations, expressions, and warm language make her feel like a real companion, not just a UI element
The escalation flow works end to end, a severity 7+ check-in triggers Claude to flag it, the pattern tracker detects repeated distress, and the Fetch.ai chat connects users to real support!
Successfully integrating two sponsor APIs (Fetch.ai ASI:One, Lovable) into a cohesive product experience.

## What we learned
Building Mood Mapping taught us how much thoughtful design matters in mental health tools. The difference between a user feeling supported versus feeling clinical comes down to small details like word choice, animation timing, and mascot expressions. We also learned how critical it is to provide real-time, accurate data in these situations. When someone is in distress, outdated or generic resources can do more harm than good, which is why connecting users to live, local support through the Fetch.ai agent was so important to get right. In addition, we deepened our understanding of prompt engineering and learnt how to use new tools like Lovable, we have never used before!

## What's next for Mood Mapping
Live therapist search using Perplexity API to find real, available therapists by location and insurance in real time. We can have Maple evolve in which the appearance and personality grow with your streak! The push notifications powered by the Fetch.ai agent — Maple checks in if you haven't logged a mood in 2+ days.
