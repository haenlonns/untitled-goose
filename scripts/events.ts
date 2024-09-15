interface EventDetail_old {
	message: string;
	time: Date;
}

const breakEvent_old = new CustomEvent<EventDetail_old>("breakEvent", {
	detail: {
		message: "Break Event Triggered",
		time: new Date(),
	},
});

const pomodoroEvent_old = new CustomEvent<EventDetail_old>("pomodoroEvent", {
	detail: {
		message: "Pomodoro Event Triggered",
		time: new Date(),
	},
});

//! Step 3: Add an event listener with proper typing
// document.addEventListener(
//   "breakEvent",
//   (event: CustomEvent<EventDetail>) => {
//     console.log("Custom event triggered!");
//     console.log("Message:", event.detail.message);
//     console.log("Time:", event.detail.time);
//   }
// );

//! Step 4: Dispatch the custom event
// document.dispatchEvent(breakEvent);
