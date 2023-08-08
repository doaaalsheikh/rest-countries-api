const mode = document.querySelector(".mode-container");

function getModeFromStorage() {
	let modeSelection = "";
	if (window.localStorage.getItem("mode")) {
		if (window.localStorage.getItem("mode") === "dark-mode") {
			modeSelection = "dark-mode";
			mode.children[1].className = "dark-mode";
			mode.children[1].textContent = "Light Mode";
		} else {
			modeSelection = "light-mode";
			mode.children[1].className = "light-mode";
			mode.children[1].textContent = "Dark Mode";
		}
	} else {
		modeSelection = "light-mode";
		mode.children[1].className = "light-mode";
		window.localStorage.setItem("mode", modeSelection);
	}
	console.log(modeSelection);
	return modeSelection;
}

export default getModeFromStorage;
