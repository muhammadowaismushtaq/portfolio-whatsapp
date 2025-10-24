// 🎵 Message Sent Sound
var audio = new Audio("assets/sentmessage.mp3");

// 📞 Contact Section
var contactString = `
<div class='social'>
    <a href='mailto:muhammadowaismushtaq@outlook.com'>
        <div class='socialItem'>
            <img class='socialItemI' src='images/email.svg' alt='Email'/>
        </div>
    </a>
    <a target='_blank' href='https://github.com/muhammadowaismushtaq'>
        <div class='socialItem'>
            <img class='socialItemI' src='images/github.svg' alt='GitHub'/>
        </div>
    </a>
    <a href='https://www.linkedin.com/in/muhammadowaismushtaq' target='_blank' rel='noopener noreferrer'>
        <div class='socialItem'>
            <img class='socialItemI' src='images/linkedin.svg' alt='LinkedIn'/>
        </div>
    </a>
</div>
`;

// 📄 Resume Section
var resumeString = `
<img src='images/resumeThumbnail.png' class='resumeThumbnail' alt='Resume Preview'>
<div class='downloadSpace'>
    <div class='pdfname'>
        <img src='images/pdf.png' alt='PDF Icon'>
        <label>Resume - Muhammad Owais Mushtaq.pdf</label>
    </div>
    <a href='https://github.com/muhammadowaismushtaq/muhammadowaismushtaq.github.io/raw/main/assets/resume/Resume%20-%20Muhammad%20Owais%20Mushtaq.pdf' 
       download='Resume - Muhammad Owais Mushtaq.pdf' 
       target='_blank'>
        <img class='download' src='images/downloadIcon.svg' alt='Download Icon'>
    </a>
</div>
`;

// 📍 Address Section
var addressString = `
<div class='mapview'>
    <iframe 
        class='map'
        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14461.369212989157!2d67.1320497!3d25.022454949999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb346f4ee2f512f%3A0x75bf3f7abcacdafc!2sGulshan-e-Maymar%2C%20Karachi!5e0!3m2!1sen!2s!4v1761299973159!5m2!1sen!2s'
        width='600'
        height='450'
        style='border:0;'
        allowfullscreen=''
        loading='lazy'
        referrerpolicy='no-referrer-when-downgrade'>
    </iframe>
</div>
<label class='add'>
    <address>
        Gulshan-e-Maymar<br>
        Karachi, Pakistan
    </address>
</label>
`;


// Initialize site
function startFunction() {
    setLastSeen();
    waitAndResponce("intro");
}

// Update "last seen" time
function setLastSeen() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    document.getElementById("lastseen").innerText = `last seen today at ${hours}:${minutes}`;
}

// Toggle fullscreen DP
function closeFullDP() {
    const dp = document.getElementById("fullScreenDP");
    dp.style.display = dp.style.display === "flex" ? "none" : "flex";
}


function openFullScreenDP() {
    const dp = document.getElementById("fullScreenDP");
    dp.style.display = dp.style.display === "flex" ? "none" : "flex";
}

// Send message on Enter
function isEnter(event) {
    if (event.keyCode === 13) sendMsg();
}

function clearChat() {
    document.getElementById("listUL").innerHTML = "";
    waitAndResponce('intro');
}

function playSound() {
    audio.play();
}

// Send chat message
function sendMsg() {
    const input = document.getElementById("inputMSG");
    const text = input.value.trim();
    if (!text) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const li = document.createElement("li");
    const msgDiv = document.createElement("div");
    const textDiv = document.createElement("div");
    const timeLabel = document.createElement("label");

    msgDiv.className = "sent";
    textDiv.className = "green";
    timeLabel.className = "dateLabel";

    textDiv.innerText = text;
    timeLabel.innerText = `${hours}:${minutes}`;
    textDiv.appendChild(timeLabel);
    msgDiv.appendChild(textDiv);
    li.appendChild(msgDiv);

    document.getElementById("listUL").appendChild(li);
    const chatBox = document.getElementById("chatting");
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => waitAndResponce(text), 1500);
    input.value = "";
    playSound();
}

function sendTextMessage(textToSend) {
    setTimeout(setLastSeen, 1000);
    var date = new Date();
    var myLI = document.createElement("li");
    var myDiv = document.createElement("div");
    var greendiv = document.createElement("div");
    var dateLabel = document.createElement("label");
    dateLabel.setAttribute("id", "sentlabel");
    dateLabel.id = "sentlabel";
    dateLabel.innerText = date.getHours() + ":" + date.getMinutes();
    myDiv.setAttribute("class", "received");
    greendiv.setAttribute("class", "grey");
    greendiv.innerHTML = textToSend;
    myDiv.appendChild(greendiv);
    myLI.appendChild(myDiv);
    greendiv.appendChild(dateLabel);
    document.getElementById("listUL").appendChild(myLI);
    var s = document.getElementById("chatting");
    s.scrollTop = s.scrollHeight;
    playSound();
}

function waitAndResponce(inputText) {
    var lastSeen = document.getElementById("lastseen");
    lastSeen.innerText = "typing...";
    switch (inputText.toLowerCase().trim()) {
        case "intro":
            setTimeout(() => {
                sendTextMessage(
                    "Hey, I’m <span class='bold'><a class='alink'>Owais</a></span> 👋🏻<br><br>" +
                    "I’m a <span class='bold'>Software Development Engineer</span> with over 3 years of experience building big-deal apps (<span class='bold'>SaaS</span>) using <span class='bold'>Java/Spring Boot</span> on the back end and <span class='bold'>Angular</span> for the cool front end.<br><br>" +
                    "I’ve led full-cycle projects — from architecture design and sprint planning to mentoring engineers and delivering production-ready solutions. 🚀<br><br>" +
                    "I'm all about clean code, awesome automation (<span class='bold'>DevOps</span>), and building reliable, scalable systems. Let's get things done! ✨<br><br>" +
                    "👉 Type <span class='bold'>'help'</span> anytime to explore more about me!"
                );
            }, 2000);
            break;

        case "help":
            sendTextMessage(
                "<span class='sk'>" +
                "Here are some quick commands to learn more about me 👇<br><br>" +
                "<span class='bold'>'skills'</span> – View my technical skills<br>" +
                "<span class='bold'>'resume'</span> – Download or view my resume<br>" +
                "<span class='bold'>'education'</span> – See my academic background<br>" +
                "<span class='bold'>'projects'</span> – Explore my featured projects<br>" +
                "<span class='bold'>'contact'</span> – Get my contact details<br>" +
                "<span class='bold'>'address'</span> – View my current location<br>" +
                "<span class='bold'>'about'</span> – Learn about this site<br>" +
                "<span class='bold'>'clear'</span> – Clear the chat<br><br>" +
                "<span class='tip'>💡 Tip: You can type ‘help’ anytime to see this list again.</span>" +
                "</span>"
            );
            break;

        case "resume":
            sendTextMessage(resumeString);
            break;

        case "skills":
            sendTextMessage(
                "<span class='sk'>" +
                "Here’s a quick look at what I work with 👇<br><br>" +

                "<span class='bold'>Code & Frameworks</span><br>" +
                "Java (Spring Boot) · TypeScript (Angular) · SQL · Hibernate · JPA<br>" +
                "RESTful APIs · OpenAPI/Swagger · Unit Testing (JUnit)<br><br>" +

                "<span class='bold'>Cloud & DevOps</span><br>" +
                "GitHub Actions · Jenkins · Bitbucket Pipelines · Docker · Kubernetes " +
                "SonarCloud · Jacoco · Azure · AWS<br><br>" +

                "<span class='bold'>Data & Reporting</span><br>" +
                "SQL Server · Stored Procedures · Query Optimization · JasperReports<br><br>" +

                "<span class='bold'>Process & Delivery</span><br>" +
                "Agile (Scrum/Kanban) · Requirement Elicitation & Validation · Process Definition for CMMI & ISO Standards<br><br>" +
                "</span>"
            );
            break;

        case "education":
            sendTextMessage(
                "Academics Checkpoint! 🎓<br><br>" +
                "<span class='bold'>Bachelors in Computer Science</span><br>" +
                "<a class='alink' href='https://www.nu.edu.pk/' target='_blank'>National University of Computer and Emerging Sciences (FAST)</a><br>" +
                "June 2018 – July 2022<br>" +
                "CGPA: 3.02 / 4.0"
            );
            break;

        case "address":
            sendTextMessage(addressString);
            break;

        case "clear":
            clearChat();
            break;

        case "about":
            sendTextMessage(
                "💡 <span class='bold'>Behind the Scenes</span><br><br>" +
                "This site runs on pure <span class='bold'>HTML, CSS</span>, and <span class='bold'>JavaScript</span> — no templates, no frameworks, just custom code.<br><br>" +
                "Every section you see (like this chat 👇) is powered by a few hundred lines of JavaScript and lots of late-night debugging ☕😅<br><br>" +
                "It’s hosted on <span class='bold'>GitHub Pages</span> and designed to feel like a casual WhatsApp chat — because why not make portfolios fun?<br><br>" +
                "🚀 Want to peek under the hood? Check out the code here 👉 <a class='alink' target='_blank' href='https://github.com/muhammadowaismushtaq/portfolio-whatsapp'><span class='bold'>GitHub Repo</span></a>"
            );
            break;

        case "contact":
            sendTextMessage(contactString);
            break;

        case "projects":
            sendTextMessage(
                "Some cool things I've built! 👇<br><br>" +

                "<span class='bold'>1. ATM Cash Predictor 💸</span><br>" +
                "Used <span class='bold'>Machine Learning</span> (Linear Regression & XGBoost) to predict optimal ATM cash requirements — minimizing storage costs and avoiding cashouts.<br>" +
                "<a class='alink' target='_blank' href='https://github.com/muhammadowaismushtaq/atm-cash-predictor'>View Project ↗</a><br><br>" +

                "<span class='bold'>2. Human Activity Recognition (FYP) 🏃‍♂️</span><br>" +
                "My Final Year Project — applied <span class='bold'>Deep Learning</span> (CNN, InceptionV3, etc.) to enable video-based recognition of human actions.<br>" +
                "<a class='alink' target='_blank' href='https://github.com/muhammadowaismushtaq/researches/tree/main/vision-based-human-activity-recognition'>View Project ↗</a><br><br>" +

                "<span class='bold'>3. Custom Brain Tumor Detector 🧠</span><br>" +
                "Developed a CNN-based brain tumor detection model, enhanced accuracy with a pre-trained <span class='bold'>VGG16</span> architecture.<br>" +
                "<a class='alink' target='_blank' href='https://github.com/muhammadowaismushtaq/brain-tumor-detector'>View Project ↗</a><br><br>" +

                "Check out more of my projects on GitHub 👇<br>" +
                "<div class='social'>" +
                "<a target='_blank' href='https://github.com/muhammadowaismushtaq'>" +
                "<div class='socialItem'>" +
                "<img class='socialItemI' src='images/github.svg' alt='GitHub'>" +
                "</div>" +
                "</a>" +
                "</div>"
            );
            break;

        default:
            setTimeout(() => {
                sendTextMessage("Hey, I couldn’t catch that 😅<br>Type <span class='bold'>'help'</span> to see what I can do!"
                );
            }, 2000);
            break;
    }

}
