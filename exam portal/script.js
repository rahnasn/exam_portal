// Exam Configuration & Question Dataset
const examDurationMinutes = 10; 
const questions = [
    {
        id: 1,
        question: "Which runtime environment allows JavaScript to execute on a backend server?",
        options: ["Node.js", "V8 Engine", "React.js", "Next.js"],
        correct: 0
    },
    {
        id: 2,
        question: "Which of the following is an open-source relational database management system?",
        options: ["MongoDB", "MySQL", "Firebase", "Redis"],
        correct: 1
    },
    {
        id: 3,
        question: "What CSS structure variable declaration defines a globally accessible root item?",
        options: [":root", "#root", ".root", "*root"],
        correct: 0
    }
];

// Application State Tracking
let currentIdx = 0;
let userAnswers = new Array(questions.length).fill(null);
let timeRemaining = examDurationMinutes * 60;
let countdownInterval;

// Initialize Portal
function initExam() {
    renderQuestion();
    renderPalette();
    startTimer();
}

function renderQuestion() {
    const q = questions[currentIdx];
    document.getElementById("question-number").innerText = `Question ${currentIdx + 1} of ${questions.length}`;
    document.getElementById("question-text").innerText = q.question;
    
    const container = document.getElementById("options-container");
    container.innerHTML = "";
    
    q.options.forEach((option, idx) => {
        const isSelected = userAnswers[currentIdx] === idx;
        const label = document.createElement("label");
        label.className = `option-label ${isSelected ? 'selected' : ''}`;
        label.innerHTML = `
            <input type="radio" name="quiz-option" value="${idx}" ${isSelected ? 'checked' : ''} onclick="selectOption(${idx})">
            ${option}
        `;
        container.appendChild(label);
    });

    // Control structural footer visibility limits
    document.getElementById("prev-btn").disabled = (currentIdx === 0);
    document.getElementById("next-btn").innerText = (currentIdx === questions.length - 1) ? "Save Finish" : "Next & Save";
}

function renderPalette() {
    const grid = document.getElementById("palette-grid");
    grid.innerHTML = "";
    questions.forEach((_, idx) => {
        const btn = document.createElement("button");
        btn.innerText = idx + 1;
        btn.className = "palette-btn";
        if (idx === currentIdx) btn.classList.add("active");
        if (userAnswers[idx] !== null) btn.classList.add("answered");
        
        btn.onclick = () => jumpToQuestion(idx);
        grid.appendChild(btn);
    });
}

function selectOption(index) {
    userAnswers[currentIdx] = index;
    renderQuestion();
    renderPalette();
}

function clearSelection() {
    userAnswers[currentIdx] = null;
    renderQuestion();
    renderPalette();
}

function navigateQuestion(step) {
    currentIdx += step;
    if (currentIdx < 0) currentIdx = 0;
    if (currentIdx >= questions.length) currentIdx = questions.length - 1;
    renderQuestion();
    renderPalette();
}

function jumpToQuestion(index) {
    currentIdx = index;
    renderQuestion();
    renderPalette();
}

function startTimer() {
    countdownInterval = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            evaluateExam(); // Auto-submission triggers here
        } else {
            timeRemaining--;
            const mins = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
            const secs = (timeRemaining % 60).toString().padStart(2, '0');
            document.getElementById("clock").innerText = `${mins}:${secs}`;
        }
    }, 1000);
}

function confirmSubmit() {
    const unanswered = userAnswers.filter(ans => ans === null).length;
    let msg = "Are you sure you want to finish the exam?";
    if (unanswered > 0) {
        msg += `\nYou still have ${unanswered} unanswered question(s).`;
    }
    if (confirm(msg)) {
        clearInterval(countdownInterval);
        evaluateExam();
    }
}

function evaluateExam() {
    let score = 0;
    questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correct) {
            score++;
        }
    });

    // Toggle Visibility UI layers
    document.getElementById("exam-panel").classList.add("hidden");
    document.getElementById("palette-panel").classList.add("hidden");
    document.getElementById("timer-box").classList.add("hidden");
    
    document.getElementById("final-score").innerText = score;
    document.getElementById("total-score").innerText = questions.length;
    document.getElementById("result-panel").classList.remove("hidden");
}

// Fire portal operational cycle initiation
window.onload = initExam;
