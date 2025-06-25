const questions = [
  {
    q: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    answer: 3,
  },
  {
    q: "What does CSS stand for?",
    options: [
      "Central Style Sheets",
      "Cascading Style Sheets",
      "Cascading Simple Sheets",
      "Cars SUVs Sailboats"
    ],
    answer: 1,
  },
  {
    q: "Which HTML attribute is used to define inline styles?",
    options: ["class", "style", "font", "styles"],
    answer: 1,
  }
];

const TOTAL_TIME = 10;
let currentQuestion = 0;
let score = 0;
let timeLeft = TOTAL_TIME;
let timerInterval;

const quizBody = document.getElementById("quiz-body");

function loadQuestion() {
  clearInterval(timerInterval);
  timeLeft = TOTAL_TIME;

  const { q, options } = questions[currentQuestion];
  quizBody.innerHTML = `
    <div class="question">${currentQuestion + 1}. ${q}</div>
    <div id="timer">⏳ Time left: ${timeLeft}s</div>
    <div id="time-bar-container"><div id="time-bar"></div></div>
    <div class="options">
      ${options.map((opt, i) => `<button class="btn-option" data-index="${i}">${opt}</button>`).join("")}
    </div>
    <div class="quiz-footer">
      <span>Question ${currentQuestion + 1} of ${questions.length}</span>
      <button class="btn-next" id="next-btn" disabled>Next</button>
    </div>
  `;

  document.querySelectorAll(".btn-option").forEach(btn => {
    btn.addEventListener("click", selectOption);
  });

  updateTimeBar();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  document.getElementById("timer").innerText = `⏳ Time left: ${timeLeft}s`;
  updateTimeBar();

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    document.getElementById("timer").innerText = "⏰ Time’s Up!";
    disableOptions();
    showCorrectAnswer();
    document.getElementById("next-btn").disabled = false;
  }
}

function updateTimeBar() {
  const widthPercent = (timeLeft / TOTAL_TIME) * 100;
  document.getElementById("time-bar").style.width = `${widthPercent}%`;
}

function disableOptions() {
  document.querySelectorAll(".btn-option").forEach(btn => btn.disabled = true);
}

function selectOption(e) {
  clearInterval(timerInterval);

  const selectedBtn = e.currentTarget;
  const selectedIdx = parseInt(selectedBtn.dataset.index, 10);
  const correctIdx = questions[currentQuestion].answer;

  disableOptions();

  if (selectedIdx === correctIdx) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("wrong");
    showCorrectAnswer();
  }

  document.getElementById("next-btn").disabled = false;
}

function showCorrectAnswer() {
  const correctIdx = questions[currentQuestion].answer;
  document.querySelector(`.btn-option[data-index="${correctIdx}"]`).classList.add("correct");
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  clearInterval(timerInterval);
  quizBody.innerHTML = `
    <div class="result">
      <h2>Quiz Completed!</h2>
      <p class="score">${score} / ${questions.length}</p>
      <canvas id="resultChart" width="250" height="250"></canvas>
      <button class="btn-restart">Play Again</button>
    </div>
  `;

  const ctx = document.getElementById("resultChart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Correct", "Incorrect"],
      datasets: [{
        data: [score, questions.length - score],
        backgroundColor: ["#4caf50", "#e53935"]
      }]
    },
    options: {
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });

  document.querySelector(".btn-restart").addEventListener("click", restart);
}

function restart() {
  currentQuestion = 0;
  score = 0;
  loadQuestion();
}

quizBody.addEventListener("click", (e) => {
  if (e.target && e.target.id === "next-btn" && !e.target.disabled) {
    nextQuestion();
  }
});

loadQuestion();




