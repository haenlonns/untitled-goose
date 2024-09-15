interface Timer {
	pomodoro: number;
	shortBreak: number;
	longBreak: number;
	longBreakInterval: number;
	sessions: number;
	mode?: "pomodoro" | "shortBreak" | "longBreak";
	remainingTime?: {
		total: number;
		minutes: number;
		seconds: number;
	};
}

type Interval = number | undefined;

const timer: Timer = {
	pomodoro: 25,
	shortBreak: 5,
	longBreak: 15,
	longBreakInterval: 4,
	sessions: 0,
};

let interval: Interval;

const mainButton = document.getElementById("js-btn");
mainButton.addEventListener("click", () => {
	const { action } = mainButton.dataset;
	if (action === "start") {
		startTimer();
	} else {
		stopTimer();
	}
});

const modeButtons = document.querySelector("#js-mode-buttons");
modeButtons.addEventListener("click", handleMode);

function getRemainingTime(endTime: number) {
	const currentTime = Date.now();
	const difference = endTime - currentTime;

	const total = Math.floor(difference / 1000);
	const minutes = Math.floor((total / 60) % 60);
	const seconds = total % 60;

	return {
		total,
		minutes,
		seconds,
	};
}

function startTimer() {
	let { total } = timer.remainingTime;
	const endTime = Date.now() + total * 1000;

	if (timer.mode === "pomodoro") timer.sessions++;

	mainButton.dataset.action = "stop";
	mainButton.textContent = "stop";
	mainButton.classList.add("active");

	interval = setInterval(function () {
		timer.remainingTime = getRemainingTime(endTime);
		updateClock();

		total = timer.remainingTime.total;
		if (total <= 0) {
			clearInterval(interval);

			switch (timer.mode) {
				case "pomodoro":
					if (timer.sessions % timer.longBreakInterval === 0) {
						switchMode("longBreak");
					} else {
						switchMode("shortBreak");
					}
					break;
				default:
					switchMode("pomodoro");
			}

			startTimer();
		}
	}, 1000);
}

function stopTimer() {
	clearInterval(interval);

	mainButton.dataset.action = "start";
	mainButton.textContent = "start";
	mainButton.classList.remove("active");
}

function updateClock() {
	const { remainingTime } = timer;
	const minutes = `${remainingTime.minutes}`.padStart(2, "0");
	const seconds = `${remainingTime.seconds}`.padStart(2, "0");

	const min = document.getElementById("js-minutes");
	const sec = document.getElementById("js-seconds");
	min.textContent = minutes;
	sec.textContent = seconds;

	const text = timer.mode === "pomodoro" ? "Get back to work!" : "Take a break!";
	document.title = `${minutes}:${seconds} — ${text}`;
}

function switchMode(mode) {
	timer.mode = mode;
	timer.remainingTime = {
		total: timer[mode] * 60,
		minutes: timer[mode],
		seconds: 0,
	};

	document.querySelectorAll("button[data-mode]").forEach((e) => e.classList.remove("active"));
	document.querySelector(`[data-mode="${mode}"]`).classList.add("active");
	document.body.style.backgroundColor = `var(--${mode})`;

	updateClock();
}

function handleMode(event) {
	const { mode } = event.target.dataset;

	if (!mode) return;

	switchMode(mode);
	stopTimer();
}

document.addEventListener("DOMContentLoaded", () => {
	switchMode("pomodoro");
});
