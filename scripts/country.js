import getModeFromStorage from "./app.js";

document.addEventListener("DOMContentLoaded", () => {
	const container = document.querySelector(".container");
	const header = document.querySelector("header");
	const countryFlag = document.getElementById("country-flag");
	const countryName = document.getElementById("country-name");
	const nativeName = document.getElementById("native-name");
	const population = document.getElementById("population");
	const region = document.getElementById("region");
	const subRegion = document.getElementById("sub-region");
	const capital = document.getElementById("capital");
	const topLevelDomain = document.getElementById("top-level-domain");
	const currencies = document.getElementById("currencies");
	const languages = document.getElementById("languages");
	const borderCountries = document.getElementById("borders");
	const btnBack = document.getElementById("btn-back");
	const mode = document.querySelector(".mode-container");

	let modeSelection = getModeFromStorage();

	// Function To Get Parameters From URL
	const getQueryParams = (url) => {
		let queryParams = {};
		let queryString = url.split("?")[1];
		queryString
			? queryString.split("&").forEach((param) => {
					const [key, value] = param.split("=");
					queryParams[key] = decodeURIComponent(value);
			  })
			: (queryParams = {});
		return queryParams;
	};

	fetch("updated-data.json")
		.then((response) => response.json())
		.then((data) => {
			let params = getQueryParams(window.location.href);

			let countryName = params !== {} ? params.country : "";
			let country = data.filter(
				(country) => country.name.common === countryName
			);
			renderCountryDetails(
				country
				// country.filter((country) => country.name.common !== "Israel")
			);
		})
		.catch((error) => {
			console.error("Failed To Fetch Country Details", error);
		});

	// Function TO Render Country Details
	const renderCountryDetails = (country) => {
		modeSelection = getModeFromStorage();

		// Get Countries Code List From Storage To Display Borders By Names
		let countryCodeName = JSON.parse(window.localStorage.getItem("codes"));
		if (country.length > 0) {
			countryFlag.src = country[0].flags ? country[0].flags.png : "";
			countryName.textContent = country[0].name.common
				? country[0].name.common
				: "";
			nativeName.textContent = Object.values(country[0].name.nativeName)[0]
				.official
				? Object.values(country[0].name.nativeName)[0].official
				: "";
			population.textContent = country[0].population
				? country[0].population
				: "";
			region.textContent = country[0].region ? country[0].region : "";
			subRegion.textContent = country[0].subregion ? country[0].subregion : "";
			capital.textContent = country[0].capital[0] ? country[0].capital[0] : "";
			topLevelDomain.textContent = country[0].tld[0] ? country[0].tld[0] : "";
			currencies.textContent = Object.values(country[0].currencies)[0].name
				? Object.values(country[0].currencies)[0].name
				: "";
			languages.textContent = Object.values(country[0].languages)
				? Object.values(country[0].languages).join(", ")
				: "";
			if (country[0].borders) {
				borderCountries.innerHTML = "";
				country[0].borders.forEach((element) => {
					const border = document.createElement("a");

					// Get Country Name By Its Code
					for (const countryName in countryCodeName) {
						if (countryCodeName.hasOwnProperty(countryName)) {
							const CountryCodes = countryCodeName[countryName];
							if (CountryCodes.includes(element)) {
								// Display Borders Countries
								border.textContent = countryName;
								border.href = `details.html?country=${countryName}`;
								borderCountries.appendChild(border);

								border.classList.add(modeSelection);
							}
						}
					}
				});
			} else {
				borderCountries.innerHTML = "-";
			}
		} else container.children[1].innerHTML = `<h1>No Country Found<h1>`;

		// Adding Mode Selction Class
		container.classList.add(modeSelection);
		header.classList.add(modeSelection);
		btnBack.classList.add(modeSelection);
		countryFlag.classList.add(modeSelection);
		for (let i = 0; i < borderCountries.children.length; i++) {
			borderCountries.children[i].classList.add("box-shadow");
			borderCountries.children[i].classList.add(modeSelection);
		}
	};

	btnBack.addEventListener("click", () => {
		btnBack.href = "./index.html";
	});

	// Add EventListener To Visibility Mode To Toggle Between Dark And Light
	mode.addEventListener("click", () => {
		if (mode.children[1].className === "light-mode") {
			mode.children[1].textContent = "Light Mode";
		} else {
			mode.children[1].textContent = "Dark Mode";
		}
		mode.children[1].classList.toggle("light-mode");
		mode.children[1].classList.toggle("dark-mode");

		window.localStorage.setItem("mode", mode.children[1].className);

		container.classList.toggle("light-mode");
		container.classList.toggle("dark-mode");

		header.classList.toggle("light-mode");
		header.classList.toggle("dark-mode");

		countryFlag.classList.toggle("light-mode");
		countryFlag.classList.toggle("dark-mode");

		btnBack.classList.toggle("light-mode");
		btnBack.classList.toggle("dark-mode");

		for (let i = 0; i < borderCountries.children.length; i++) {
			borderCountries.children[i].classList.toggle("light-mode");
			borderCountries.children[i].classList.toggle("dark-mode");
		}
	});
});
