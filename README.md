# Muhammad Owais Mushtaq: WhatsApp-style Portfolio Chat

A portfolio you can **chat with**. This page looks and feels like a WhatsApp business chat: visitors ask questions and Owais's virtual assistant answers about his work, skills, projects, education and how to reach him.

[Open the chat →](https://muhammadowaismushtaq.github.io/portfolio-whatsapp/)

It also runs as the WhatsApp chat pop-up on the main portfolio site, [muhammadowaismushtaq.github.io](https://muhammadowaismushtaq.github.io) (the WhatsApp icon).

---

## ✨ Features

- **Feels like WhatsApp:** dark theme, chat bubbles, timestamps, a "typing…" indicator and a message sound.
- **Business-account assistant:** a notice at the top makes clear that replies come from an automated assistant, not from Owais, and points visitors to his real contact details.
- **Understands normal questions:** messages are matched by keywords, so "what are his skills?" or "can I hire him?" work as well as single words like `skills`.
- **Small talk:** greetings (including *salam* / *AOA*), "how are you", "are you a bot?", availability, thanks and goodbyes.
- **Quick replies:** tap-to-ask buttons (Experience, Skills, Projects, Education, Résumé, Contact, Help) so phone users don't need to type.
- **Responsive:** works on phones, tablets and desktops, including inside the main site's pop-up.
- **No dependencies:** plain HTML, CSS and JavaScript, no build step.

---

## 💬 What you can ask

| Ask about | Example messages |
|---|---|
| Experience | `experience`, "tell me about Owais" |
| Skills | `skills`, "what's his tech stack?" |
| Projects | `projects`, "what has he built?" |
| Education & research | `education`, `research`, "where did he study?" |
| Résumé | `resume`, `cv` |
| Contact | `contact`, "how can I reach him?" |
| Availability | "is he available?", "can I hire him?" |
| This chat | "about this chat" |
| Help / restart | `help`, `clear` |

Anything else gets a friendly fallback that points to `help` and `contact`.

---

## 🗂️ Project structure

```
portfolio-whatsapp/
├── index.html          # Page layout: header, message area, quick replies, input bar
├── style.css           # WhatsApp dark theme and responsive layout
├── script.js           # Chat logic: intent matching, replies, typing indicator
├── assets/
│   └── sentmessage.mp3 # Message sound
├── images/             # Profile photo, chat background, icons
└── LICENSE
```

---

## ✏️ Editing the answers

All replies live in `script.js`:

- **`INTENTS`**: a list of `{ name, pattern, reply }` entries. The first entry whose `pattern` (a regular expression) matches the visitor's message wins, so put more specific intents first.
- **`buildWelcomeReply()`** and **`buildFallbackReply()`**: the opening message and the "didn't catch that" message.
- **`QUICK_REPLIES`**: the labels on the tap-to-ask buttons.

Messages are lowercased and stripped of accents and punctuation before matching, so patterns only need lowercase, unaccented words.

---

## 🔒 Privacy & security

- Nothing typed in the chat is stored or sent anywhere: the answers are written in advance and run entirely in the browser.
- Visitor messages are only ever shown as plain text, never as HTML.
- A Content Security Policy only allows scripts, styles, images and sound from this site itself.
- Links that open in a new tab use `rel="noopener noreferrer"`.

---

## 💻 Run locally

1. Clone the repository:
   ```bash
   git clone https://github.com/muhammadowaismushtaq/portfolio-whatsapp.git
   ```
2. Serve the folder with any static file server, for example:
   ```bash
   npx serve .
   ```
   then open the address it prints. Use a server rather than opening `index.html` from disk: the page's Content Security Policy only trusts files from its own web origin.

---

## 🚀 Deployment

Hosted on **GitHub Pages** from the `main` branch: pushing to `main` updates the live chat at [muhammadowaismushtaq.github.io/portfolio-whatsapp](https://muhammadowaismushtaq.github.io/portfolio-whatsapp/).

---

## 📜 License

[MIT](LICENSE) © Muhammad Owais Mushtaq
