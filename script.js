/**
 * ========================================
 * WhatsApp-style Portfolio Chat
 * ========================================
 *
 * A small, dependency-free chat that answers questions about Owais as his
 * "business account" virtual assistant. It is embedded in the main portfolio site
 * (muhammadowaismushtaq.github.io) as the WhatsApp chat pop-up, and also works on its own.
 *
 * How it works:
 * - Each visitor message is matched against the INTENTS table (keyword patterns).
 * - The first matching intent's reply is shown after a short "typing…" delay.
 * - Replies are fixed HTML templates written in this file. Text typed by the visitor is
 *   only ever inserted with textContent, never as HTML, so it cannot inject markup.
 *
 * ========================================
 */

'use strict';

/* ----------------------------------------
 * Constants
 * ---------------------------------------- */

/** Base URL of the main portfolio site (links to the résumé and contact form). */
const PORTFOLIO_URL = "https://muhammadowaismushtaq.github.io";

/** Public résumé PDF, served by the main portfolio site. */
const RESUME_URL = `${PORTFOLIO_URL}/assets/resume/Resume%20-%20Muhammad%20Owais%20Mushtaq.pdf`;

/** Shortest and longest simulated "typing…" time before a reply appears (ms). */
const TYPING_DELAY_MIN_MS = 600;
const TYPING_DELAY_MAX_MS = 1600;

/** Extra typing time per character of the reply, so longer answers "take" a little longer. */
const TYPING_DELAY_PER_CHAR_MS = 1.5;

/** Buttons shown under the chat so visitors (especially on phones) don't have to type. */
const QUICK_REPLIES = ["Experience", "Skills", "Projects", "Education", "Résumé", "Contact", "Help"];

/** Short sound played when a message is sent or received. */
const messageSound = new Audio("assets/sentmessage.mp3");

/* ----------------------------------------
 * Reply templates (trusted HTML, authored here)
 * ---------------------------------------- */

/** @type {Record<string, string>} Reusable HTML snippets used by several replies. */
const SNIPPETS = {
    helpTip: `<p class="message-tip">💡 Tap an option below, or just ask, e.g. <em>"what are his skills?"</em></p>`,
    contactButtons: `
        <div class="link-buttons">
            <a class="link-button" href="mailto:muhammadowaismushtaq@outlook.com">
                <img alt="" src="images/email.svg"> muhammadowaismushtaq@outlook.com
            </a>
            <a class="link-button" href="https://www.linkedin.com/in/muhammadowaismushtaq/" rel="noopener noreferrer" target="_blank">
                <img alt="" src="images/linkedin.svg"> LinkedIn
            </a>
            <a class="link-button" href="https://github.com/muhammadowaismushtaq" rel="noopener noreferrer" target="_blank">
                <img alt="" src="images/github.svg"> GitHub
            </a>
        </div>`,
};

/**
 * Builds the opening message shown when the chat loads (and after "clear").
 *
 * @returns {string} Trusted HTML for the welcome message.
 */
function buildWelcomeReply() {
    return `
        <p>${getTimeOfDayGreeting()}! 👋 I'm <span class="message-heading">Owais's virtual assistant</span>.</p>
        <p>Owais is a <strong>Senior Software Engineer and tech lead</strong> at Matrix Systems, building
           wealth-management FinTech for US advisory firms.</p>
        <p>I can tell you about his experience, skills, projects, education and research, share his résumé,
           or help you get in touch with him.</p>
        ${SNIPPETS.helpTip}`;
}

/**
 * Intent table: the first intent whose pattern matches the visitor's message wins.
 * Order matters (more specific intents come first). Each reply is trusted HTML.
 *
 * @type {Array<{name: string, pattern: RegExp, reply: () => string}>}
 */
const INTENTS = [
    {
        name: "clear",
        pattern: /^(clear|reset|restart|start over)$/,
        reply: () => "", // handled specially in respondTo()
    },
    {
        name: "help",
        pattern: /\b(help|menu|options|commands|what can (you|i) (do|ask))\b/,
        reply: () => `
            <p>Here's what I can help with 👇</p>
            <ul>
                <li><strong>experience</strong>: what Owais works on</li>
                <li><strong>skills</strong>: his tech stack and tools</li>
                <li><strong>projects</strong>: products and research he's worked on</li>
                <li><strong>education</strong>: degrees, research and programs</li>
                <li><strong>résumé</strong>: view or download his résumé</li>
                <li><strong>contact</strong>: email, LinkedIn and GitHub</li>
                <li><strong>about this chat</strong>: how this page was built</li>
                <li><strong>clear</strong>: start the chat again</li>
            </ul>
            <p class="message-tip">You can also say hi, ask how I'm doing, or ask when Owais is available.</p>`,
    },
    {
        name: "aboutThisChat",
        pattern: /\b(about (this )?(chat|site|page|website)|how (was|is) this (built|made)|source code|this chat)\b/,
        reply: () => `
            <p>💡 <span class="message-heading">Behind the scenes</span></p>
            <p>This chat is plain <strong>HTML, CSS and JavaScript</strong>, with no frameworks, hosted on
               <strong>GitHub Pages</strong> and styled like a WhatsApp business chat.</p>
            <p>The answers are written in advance, so I reply instantly and nothing you type is stored or sent anywhere.</p>
            <p>Peek under the hood 👉 <a href="https://github.com/muhammadowaismushtaq/portfolio-whatsapp" rel="noopener noreferrer" target="_blank">GitHub repo</a></p>`,
    },
    {
        name: "whoAreYou",
        pattern: /\b(who are you|are you (owais|real|a bot|human|ai)|is this (owais|a bot|real)|bot|robot|assistant|your name)\b/,
        reply: () => `
            <p>I'm Owais's <strong>automated assistant</strong>, not Owais himself 🤖</p>
            <p>I answer the common questions about his work so you don't have to wait. For anything else,
               you can reach him directly. Type <strong>contact</strong>.</p>`,
    },
    {
        name: "availability",
        pattern: /\b(availab\w*|free|hire|hiring|freelance|open to|opportunit\w*|collaborat\w*|work with|job|role|position|when can|schedule|meeting|call)\b/,
        reply: () => `
            <p>I can't see Owais's calendar, but he's always happy to hear about projects, roles and collaborations. 🙌</p>
            <p>The best way is to send him a short note about what you have in mind, by email or LinkedIn,
               and he'll get back to you:</p>
            ${SNIPPETS.contactButtons}`,
    },
    {
        name: "contact",
        pattern: /\b(contact|email|e-mail|mail|reach|linkedin|github|get in touch|talk to (him|owais)|message (him|owais))\b/,
        reply: () => `
            <p>You can reach Owais directly here 👇 He reads these himself.</p>
            ${SNIPPETS.contactButtons}
            <p>Or use the <a href="${PORTFOLIO_URL}/#contact" target="_top">contact form</a> on his website.</p>`,
    },
    {
        name: "resume",
        pattern: /\b(resume|cv|curriculum)\b/,
        reply: () => `
            <a class="resume-card" download href="${RESUME_URL}" rel="noopener noreferrer" target="_blank">
                <span class="resume-file">
                    <img alt="" src="images/pdf.png">
                    <span>Resume - Muhammad Owais Mushtaq.pdf</span>
                    <img alt="Download" src="images/downloadIcon.svg">
                </span>
            </a>`,
    },
    {
        name: "projects",
        pattern: /\b(projects?|portfolio|work samples?|products?|built|urebal|mars|sketchbook)\b/,
        reply: () => `
            <p>Products and research Owais has worked on 👇</p>
            <ul>
                <li><a href="https://www.softpak.com/solutions/universal-rebalancer/" rel="noopener noreferrer" target="_blank"><strong>uRebal: backend modernization</strong></a><br>2026 – Present</li>
                <li><a href="https://www.softpak.com/solutions/urebal-hub/" rel="noopener noreferrer" target="_blank"><strong>uRebal Hub</strong></a><br>Ongoing</li>
                <li><a href="https://partipris-invest.com/advisor-wealthdesign/" rel="noopener noreferrer" target="_blank"><strong>Advisor Sketchbook</strong></a><br>Oct 2023 – Sep 2025</li>
                <li><a href="https://www.softpak.com/solutions/managed-accounts-rebalancing-system/" rel="noopener noreferrer" target="_blank"><strong>MARS</strong></a><br>Jun 2022 – Nov 2023</li>
                <li><a href="https://doi.org/10.21203/rs.3.rs-10346557/v1" rel="noopener noreferrer" target="_blank"><strong>AI-Augmented Agile MVP Development</strong></a> (research)<br>2026</li>
                <li><a href="https://github.com/muhammadowaismushtaq/brain-tumor-detector" rel="noopener noreferrer" target="_blank"><strong>Brain Tumor Detection</strong></a> (VGG-16, 97.95% accuracy)<br>Dec 2021</li>
                <li><a href="https://github.com/muhammadowaismushtaq/researches/tree/main/vision-based-human-activity-recognition" rel="noopener noreferrer" target="_blank"><strong>Vision-Based Human Activity Recognition</strong></a> (final year project)</li>
                <li><a href="https://github.com/muhammadowaismushtaq/atm-cash-predictor" rel="noopener noreferrer" target="_blank"><strong>ATM Cash Predictor</strong></a> (machine learning)</li>
            </ul>
            <p class="message-tip">More on <a href="https://github.com/muhammadowaismushtaq" rel="noopener noreferrer" target="_blank">GitHub</a>.</p>`,
    },
    {
        name: "skills",
        pattern: /\b(skills?|stack|tech|technolog\w*|tools?|languages?|frameworks?|java|spring|angular)\b/,
        reply: () => `
            <p>Here's what Owais works with 👇</p>
            <p><span class="message-heading">Backend &amp; frontend</span><br>
               Java · Spring Boot · Angular · TypeScript · RabbitMQ · Keycloak · C++ · Python</p>
            <p><span class="message-heading">Data</span><br>
               SQL Server · PostgreSQL · MySQL · Liquibase</p>
            <p><span class="message-heading">Cloud &amp; DevOps</span><br>
               Docker · Kubernetes · Azure · AWS · GitHub Actions · Jenkins · Bitbucket Pipelines · SonarCloud</p>
            <p><span class="message-heading">AI-assisted development &amp; delivery</span><br>
               Claude · GitHub Copilot · Jira · Postman</p>`,
    },
    {
        name: "education",
        pattern: /\b(education|study|studied|degree|university|fast|nuces|ms|bs|masters?|bachelors?|research\w*|thesis|paper|aspire)\b/,
        reply: () => `
            <p>🎓 <span class="message-heading">Education &amp; research</span></p>
            <ul>
                <li><strong>MS Software Project Management</strong>, FAST-NUCES · 2024–2026<br>
                    Thesis: AI-Augmented Agile MVP Development for Lean Tech Startups.</li>
                <li><strong>BS Computer Science</strong>, FAST-NUCES · 2018–2022<br>
                    Final year project: Vision-Based Human Activity Recognition (deep learning on video).</li>
                <li><strong>Research:</strong>
                    <a href="https://doi.org/10.21203/rs.3.rs-10346557/v1" rel="noopener noreferrer" target="_blank">AI-Augmented Agile MVP Development for Lean Tech Startups</a>,
                    preprint under review at <em>Innovations in Systems and Software Engineering</em> (Springer).</li>
                <li><strong>Research assistant</strong>, FAST School of Management · 2025–2026<br>
                    Co-author of a funded field study on sustainable development in Pakistan's date palm industry (under review).</li>
                <li><strong>Aspire Leadership Program</strong>, 2024.</li>
            </ul>`,
    },
    {
        name: "experience",
        pattern: /\b(experience|about (him|owais)|who is owais|tell me about|background|career|job history|work|company|matrix|years?)\b/,
        reply: () => `
            <p>Owais is a <strong>Senior Software Engineer and tech lead</strong> at Matrix Systems, building
               wealth-management FinTech for US advisory firms.</p>
            <p>Over 4+ years he's modernized legacy platforms without big-bang risk, built new products from scratch,
               and set up the pipelines, quality gates and AI-first workflows that let a team ship fast without
               cutting corners.</p>
            <ul>
                <li><strong>4</strong> wealth-management products shipped and scaled</li>
                <li><strong>5</strong> engineers led as tech lead</li>
            </ul>
            <p class="message-tip">Type <strong>projects</strong> to see what he's built.</p>`,
    },
    {
        name: "location",
        pattern: /\b(where (are you|is he|is owais|do you live)|located|location|based|country|city|time ?zone)\b/,
        reply: () => `
            <p>Owais is based in <strong>Pakistan</strong> and builds software for US advisory firms. 🌍</p>`,
    },
    {
        name: "howAreYou",
        pattern: /\b(how are (you|u)|how r u|how('?s| is) it going|how do you do|what'?s up|wassup|sup)\b/,
        reply: () => `<p>I'm doing great, thanks for asking! 😊 How can I help you today?</p>`,
    },
    {
        name: "thanks",
        pattern: /\b(thanks?|thank you|thx|ty|shukriya|appreciate)\b/,
        reply: () => `<p>You're welcome! 😊 Anything else you'd like to know?</p>`,
    },
    {
        name: "goodbye",
        pattern: /\b(bye|goodbye|see you|see ya|take care|allah hafiz|khuda hafiz|good night)\b/,
        reply: () => `<p>Thanks for stopping by! 👋 Have a great day.</p>`,
    },
    {
        name: "salam",
        pattern: /\b(salam|salaam|assalam\w*|aoa|asalam\w*)\b/,
        reply: () => `<p>Wa alaikum assalam! 👋 How can I help you today?</p>${SNIPPETS.helpTip}`,
    },
    {
        name: "greeting",
        pattern: /\b(hi+|hello+|hey+|hiya|yo|greetings|good (morning|afternoon|evening))\b/,
        reply: () => `<p>${getTimeOfDayGreeting()}! 👋 How can I help you today?</p>${SNIPPETS.helpTip}`,
    },
];

/**
 * Reply used when no intent matches.
 *
 * @returns {string} Trusted HTML for the fallback message.
 */
function buildFallbackReply() {
    return `
        <p>Sorry, I didn't quite catch that 😅 I'm an assistant, so I only know about Owais's work.</p>
        <p>Try one of the options below, type <strong>help</strong>, or type <strong>contact</strong>
           to reach Owais directly.</p>`;
}

/* ----------------------------------------
 * Element references
 * ---------------------------------------- */

const chatBody = document.querySelector("[data-chat-body]");
const messageList = document.querySelector("[data-message-list]");
const contactStatus = document.querySelector("[data-contact-status]");
const quickRepliesContainer = document.querySelector("[data-quick-replies]");
const sendForm = document.querySelector("[data-send-form]");
const messageInput = document.getElementById("messageInput");
const photoViewer = document.querySelector("[data-photo-viewer]");
const openPhotoButton = document.querySelector("[data-open-photo]");
const closePhotoButton = document.querySelector("[data-close-photo]");

/**
 * Promise chain that makes replies appear one after another, in order, even if the
 * visitor sends several messages quickly.
 *
 * @type {Promise<void>}
 */
let replyQueue = Promise.resolve();

/* ----------------------------------------
 * Helpers
 * ---------------------------------------- */

/**
 * Formats a time as HH:MM (24-hour, zero-padded), like WhatsApp message timestamps.
 *
 * @param {Date} [date=new Date()] - The time to format.
 * @returns {string} The formatted time, e.g. "09:05".
 */
function formatMessageTime(date = new Date()) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

/**
 * Returns "Good morning", "Good afternoon" or "Good evening" for the visitor's local time.
 *
 * @returns {string} A greeting that matches the time of day.
 */
function getTimeOfDayGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
        return "Good morning";
    }
    return hour < 18 ? "Good afternoon" : "Good evening";
}

/**
 * Returns a promise that resolves after the given delay.
 *
 * @param {number} delayInMilliseconds - How long to wait.
 * @returns {Promise<void>} Resolves once the delay has passed.
 */
function waitFor(delayInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, delayInMilliseconds));
}

/**
 * Plays the message sound. Browsers may block audio until the visitor has interacted with
 * the page; that rejection is expected and safely ignored.
 *
 * @returns {void}
 */
function playMessageSound() {
    messageSound.currentTime = 0;
    messageSound.play().catch(() => {
        // Autoplay blocked or audio unavailable: the chat works fine without sound.
    });
}

/**
 * Scrolls the message area to the newest message.
 *
 * @returns {void}
 */
function scrollToLatestMessage() {
    chatBody.scrollTop = chatBody.scrollHeight;
}

/**
 * Lowercases the visitor's message and strips accents and punctuation so patterns match
 * reliably (e.g. "Résumé!" becomes "resume").
 *
 * @param {string} rawText - The message exactly as typed.
 * @returns {string} The normalized text.
 */
function normalizeMessage(rawText) {
    return rawText
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[’']/g, "'")
        .replace(/[^\p{L}\p{N}' ]+/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Finds the intent that matches the visitor's message.
 *
 * @param {string} rawText - The message exactly as typed.
 * @returns {{name: string, reply: () => string}|null} The matching intent, or null if none matches.
 */
function findMatchingIntent(rawText) {
    const normalizedText = normalizeMessage(rawText);
    return INTENTS.find((intent) => intent.pattern.test(normalizedText)) || null;
}

/* ----------------------------------------
 * Rendering
 * ---------------------------------------- */

/**
 * Creates an empty chat bubble (list item + bubble + timestamp) and adds it to the chat.
 *
 * @param {"sent"|"received"} direction - Whether the visitor sent it or the assistant did.
 * @returns {HTMLElement} The bubble element, ready for content to be inserted before its timestamp.
 */
function appendMessageBubble(direction) {
    const listItem = document.createElement("li");
    listItem.className = `message message--${direction}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";

    const timeLabel = document.createElement("time");
    timeLabel.className = "message-time";
    timeLabel.textContent = formatMessageTime();

    bubble.appendChild(timeLabel);
    listItem.appendChild(bubble);
    messageList.appendChild(listItem);
    return bubble;
}

/**
 * Shows a message typed by the visitor. The text is inserted as plain text (never as HTML).
 *
 * @param {string} visitorText - What the visitor typed.
 * @returns {void}
 */
function showVisitorMessage(visitorText) {
    const bubble = appendMessageBubble("sent");
    const textElement = document.createElement("p");
    textElement.textContent = visitorText;
    bubble.insertBefore(textElement, bubble.lastChild);
    scrollToLatestMessage();
}

/**
 * Shows a reply from the assistant.
 *
 * @param {string} replyHtml - Trusted HTML from one of the reply templates in this file.
 * @returns {void}
 */
function showAssistantMessage(replyHtml) {
    const bubble = appendMessageBubble("received");
    const contentElement = document.createElement("div");
    contentElement.innerHTML = replyHtml; // trusted template only, never visitor input
    bubble.insertBefore(contentElement, bubble.lastChild);
    scrollToLatestMessage();
}

/**
 * Shows the animated "typing" dots and the "typing…" status, and returns a function that removes them.
 *
 * @returns {() => void} Call to hide the typing indicator again.
 */
function showTypingIndicator() {
    contactStatus.textContent = "typing…";

    const listItem = document.createElement("li");
    listItem.className = "message message--received";
    listItem.setAttribute("aria-label", "Assistant is typing");
    listItem.innerHTML = `<div class="message-bubble"><span class="typing-indicator"><span></span><span></span><span></span></span></div>`;
    messageList.appendChild(listItem);
    scrollToLatestMessage();

    return () => {
        listItem.remove();
        contactStatus.textContent = "online";
    };
}

/**
 * Renders the quick-reply buttons under the chat.
 *
 * @returns {void}
 */
function renderQuickReplies() {
    QUICK_REPLIES.forEach((label) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "quick-reply";
        button.textContent = label;
        button.addEventListener("click", () => handleVisitorMessage(label));
        quickRepliesContainer.appendChild(button);
    });
}

/* ----------------------------------------
 * Conversation flow
 * ---------------------------------------- */

/**
 * Simulates typing for a moment that scales with the reply length, then shows the reply.
 *
 * @param {string} replyHtml - Trusted HTML to show once "typing" finishes.
 * @returns {Promise<void>} Resolves when the reply is on screen.
 */
async function replyAfterTyping(replyHtml) {
    const hideTypingIndicator = showTypingIndicator();
    const typingDelay = Math.min(
        TYPING_DELAY_MAX_MS,
        TYPING_DELAY_MIN_MS + replyHtml.length * TYPING_DELAY_PER_CHAR_MS
    );
    await waitFor(typingDelay);
    hideTypingIndicator();
    showAssistantMessage(replyHtml);
    playMessageSound();
}

/**
 * Clears the conversation and starts again with the welcome message.
 *
 * @returns {Promise<void>} Resolves once the welcome message is shown.
 */
function restartConversation() {
    messageList.replaceChildren();
    return replyAfterTyping(buildWelcomeReply());
}

/**
 * Works out the right answer to a visitor message and queues it.
 *
 * @param {string} visitorText - What the visitor typed (or the quick reply they tapped).
 * @returns {void}
 */
function respondTo(visitorText) {
    const intent = findMatchingIntent(visitorText);

    replyQueue = replyQueue.then(() => {
        if (intent && intent.name === "clear") {
            return restartConversation();
        }
        return replyAfterTyping(intent ? intent.reply() : buildFallbackReply());
    });
}

/**
 * Handles one visitor message: shows it, plays the send sound and queues the reply.
 *
 * @param {string} rawText - The message as typed.
 * @returns {void}
 */
function handleVisitorMessage(rawText) {
    const visitorText = rawText.trim();
    if (!visitorText) {
        return;
    }
    showVisitorMessage(visitorText);
    playMessageSound();
    respondTo(visitorText);
}

/**
 * Handles the send form: sends the typed message and clears the input.
 *
 * @param {SubmitEvent} submitEvent - The form submission (Enter key or send button).
 * @returns {void}
 */
function handleSendFormSubmit(submitEvent) {
    submitEvent.preventDefault();
    handleVisitorMessage(messageInput.value);
    messageInput.value = "";
}

/* ----------------------------------------
 * Profile photo viewer
 * ---------------------------------------- */

/**
 * Opens the full-screen profile photo.
 *
 * @returns {void}
 */
function openPhotoViewer() {
    photoViewer.hidden = false;
    closePhotoButton.focus();
}

/**
 * Closes the full-screen profile photo.
 *
 * @param {boolean} [restoreFocus=true] - Move keyboard focus back to the header photo. Skipped
 *        when the host page closes the chat pop-up, since the chat is no longer visible then.
 * @returns {void}
 */
function closePhotoViewer(restoreFocus = true) {
    photoViewer.hidden = true;
    if (restoreFocus) {
        openPhotoButton.focus();
    }
}

/**
 * Closes the photo viewer on Escape.
 *
 * @param {KeyboardEvent} keyboardEvent - Any key press on the page.
 * @returns {void}
 */
function handleEscapeKey(keyboardEvent) {
    if (keyboardEvent.key === "Escape" && !photoViewer.hidden) {
        closePhotoViewer();
    }
}

/* ----------------------------------------
 * Embedding in the main portfolio site
 * ---------------------------------------- */

/** Message the host page sends when it closes the chat pop-up. */
const HOST_CHAT_CLOSED_MESSAGE = "chat-modal-closed";

/**
 * Tells whether this page is running inside an iframe (the main site's chat pop-up).
 * Accessing window.top can throw for some cross-origin hosts; that also means "embedded".
 *
 * @returns {boolean} True when the chat is embedded in another page.
 */
function isEmbeddedInHostPage() {
    try {
        return window.self !== window.top;
    } catch (crossOriginError) {
        return true;
    }
}

/**
 * Resets transient UI when the host page closes the pop-up, so reopening it shows the chat
 * rather than a photo viewer left open. Only messages from this same origin are trusted.
 *
 * @param {MessageEvent} messageEvent - A message posted to this window.
 * @returns {void}
 */
function handleHostMessage(messageEvent) {
    if (messageEvent.origin !== window.location.origin) {
        return;
    }
    if (messageEvent.data && messageEvent.data.type === HOST_CHAT_CLOSED_MESSAGE) {
        closePhotoViewer(false);
    }
}

/* ----------------------------------------
 * Start-up
 * ---------------------------------------- */

/**
 * Wires up all event listeners and shows the welcome message.
 *
 * @returns {void}
 */
function initializeChat() {
    if (isEmbeddedInHostPage()) {
        // CSS uses this to fill the pop-up's full width and keep clear of the host's close button.
        document.documentElement.classList.add("is-embedded");
    }

    renderQuickReplies();

    sendForm.addEventListener("submit", handleSendFormSubmit);
    openPhotoButton.addEventListener("click", openPhotoViewer);
    closePhotoButton.addEventListener("click", () => closePhotoViewer());
    // Tapping anywhere in the viewer (backdrop or the photo itself) closes it, like WhatsApp.
    photoViewer.addEventListener("click", (clickEvent) => {
        if (clickEvent.target !== closePhotoButton) {
            closePhotoViewer();
        }
    });
    document.addEventListener("keydown", handleEscapeKey);
    window.addEventListener("message", handleHostMessage);

    // Focus the input on desktop only: on phones it would pop up the keyboard immediately.
    if (window.matchMedia("(pointer: fine)").matches) {
        messageInput.focus();
    }

    replyQueue = replyQueue.then(() => replyAfterTyping(buildWelcomeReply()));
}

initializeChat();
