import getModeFromStorage from "./app.js";

let countryCodeName = {};

document.addEventListener("DOMContentLoaded", () => {
	const container = document.querySelector(".container");
	const header = document.querySelector("header");
	const search = document.querySelector(".search");
	const filter = document.querySelector(".filter");
	const regions = document.getElementById("regions");
	const mode = document.querySelector(".mode-container");
	const countryList = document.getElementById("country-list");

	let modeSelection = getModeFromStorage();

	// Function to render the country list on the page
	const renderCountries = (countries) => {
		countryList.innerHTML = ""; // Clear the existing content
		search.value = "";
		modeSelection = getModeFromStorage();

		// Create article for each country and append them to the section element
		countries.forEach((country) => {
			// First Of All we get names of countries by their codes
			countryCodeName[country.name.common] = [
				country.cca3,
				country.cca2,
				country.cioc,
				country.fifa,
			];

			const article = document.createElement("article");
			const countryLink = document.createElement("a");
			const divFlag = document.createElement("div");
			const divCountryInfo = document.createElement("div");

			const divPopulation = document.createElement("div");
			const divContinent = document.createElement("div");
			const divCapital = document.createElement("div");

			const countryFlag = document.createElement("img");
			const countryName = document.createElement("a");

			const lblPopulation = document.createElement("span");
			const lblContinent = document.createElement("span");
			const lblCapital = document.createElement("span");

			const countryPopulation = document.createElement("span");
			const countryContinent = document.createElement("span");
			const countryCapital = document.createElement("span");

			countryFlag.src = country.flags.png;
			countryName.textContent =
				country.name.common != "" ? country.name.common : "";
			// countryName.href = `details.html`;
			countryName.href = `details.html?country=${country.name.common}`;
			// countryName.target = `blank`;

			lblPopulation.textContent = "Population: ";
			countryPopulation.textContent =
				country.population != "" ? country.population : "";

			lblContinent.textContent = "Continent: ";
			countryContinent.textContent =
				country.continents[0] !== null ? country.continents[0] : "";

			lblCapital.textContent = "Capital: ";
			countryCapital.textContent = country.capital ? country.capital[0] : "-";
			container.classList.add(modeSelection);
			header.classList.add(modeSelection);
			search.classList.add(modeSelection);
			search.children[1].classList.add(modeSelection);
			filter.classList.add(modeSelection);
			regions.classList.add(modeSelection);
			countryList.classList.add(modeSelection);
			article.classList.add(modeSelection);
			article.classList.add("box-shadow");
			divFlag.classList.add("img");
			divCountryInfo.classList.add("country-info");
			countryName.classList.add("country-name");
			countryName.classList.add(modeSelection);

			countryLink.classList.add(modeSelection);
			countryLink.classList.add("box-shadow");

			// countryName.href = `details.html`;
			countryLink.href = `details.html?country=${country.name.common}`;
			// countryLink.target = "blank";

			divFlag.appendChild(countryFlag);
			countryLink.appendChild(divFlag);

			divPopulation.appendChild(lblPopulation);
			divPopulation.appendChild(countryPopulation);

			divContinent.appendChild(lblContinent);
			divContinent.appendChild(countryContinent);

			divCapital.appendChild(lblCapital);
			divCapital.appendChild(countryCapital);

			divCountryInfo.appendChild(countryName);
			divCountryInfo.appendChild(divPopulation);
			divCountryInfo.appendChild(divContinent);
			divCountryInfo.appendChild(divCapital);

			article.appendChild(countryLink);
			article.appendChild(divCountryInfo);

			countryList.appendChild(article);
		});
		window.localStorage.setItem("codes", JSON.stringify(countryCodeName));
	};

	fetch("updated-data.json")
		.then((response) => response.json())
		.then((data) => {
			let continents = new Set(
				data.map((continent) => continent.continents[0]).sort()
			);
			continents.forEach((element) => {
				const option = document.createElement("option");
				option.textContent = element;
				option.value = element;
				regions.appendChild(option);
			});
			const option = document.createElement("option");
			option.textContent = "All Regions";
			option.value = "All";
			regions.appendChild(option);

			renderCountries(
				data.filter((country) => country.name.common !== "Israel")
			);
		})
		.catch((error) => console.error("Error fetching data:", error));
	// Add EventListener To Select Element To Get Countries By Continent
	regions.addEventListener("change", () => {
		let filteredCountries;
		fetch("updated-data.json")
			.then((response) => response.json())
			.then((data) => {
				if (regions.value.toLowerCase() !== "all") {
					filteredCountries = data.filter(
						(country) =>
							country.continents[0].toString().toLowerCase() ===
							regions.value.toLowerCase()
					);
				} else filteredCountries = data;
				renderCountries(
					filteredCountries.filter(
						(country) => country.name.common !== "Israel"
					)
				);
			})
			.catch((error) => console.error("Error fetching data:", error));

		search.children[1].value = "";
	});

	// Add EventListener To Search Input To Get Matched Countries

	search.children[1].addEventListener("change", async () => {
		const searchValue = search.children[1].value;
		let filteredCountries;

		await validateSearch();
		try {
			const response = await fetch("updated-data.json");
			const data = await response.json();
			if (searchValue) {
				filteredCountries = data.filter((country) =>
					country.name.common
						.toString()
						.toLowerCase()
						.includes(searchValue.toLowerCase())
				);
			} else filteredCountries = data;
			renderCountries(
				filteredCountries.filter(
					(country_1) => country_1.name.common !== "Israel"
				)
			);
		} catch (error) {
			return console.error("Error fetching data:", error);
		}
	});
	// Function To Validate Search Input
	function validateSearch() {
		if (!search.value.match(/^[A-Za-z]+$/)) {
			search.style.css = `border-color:red`;
			return false;
		} else {
			search.style.css = `border-color:transparent`;
			return search.value.match(/^[A-Za-z]+$/);
		}
	}

	// search.children[1].addEventListener("change", () => {
	// 	const searchValue = search.children[1].value;
	// 	let filteredCountries;

	// 	fetch("updated-data.json")
	// 		.then((response) => response.json())
	// 		.then((data) => {
	// 			if (searchValue) {
	// 				filteredCountries = data.filter((country) =>
	// 					country.name.common
	// 						.toString()
	// 						.toLowerCase()
	// 						.includes(searchValue.toLowerCase())
	// 				);
	// 			} else filteredCountries = data;
	// 			renderCountries(
	// 				filteredCountries.filter(
	// 					(country) => country.name.common !== "Israel"
	// 				)
	// 			);
	// 		})
	// 		.catch((error) => console.error("Error fetching data:", error));
	// });

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

		if (window.location.pathname.startsWith("/details")) {
		} else {
			container.classList.toggle("light-mode");
			container.classList.toggle("dark-mode");

			header.classList.toggle("light-mode");
			header.classList.toggle("dark-mode");

			filter.classList.toggle("light-mode");
			filter.classList.toggle("dark-mode");

			regions.classList.toggle("light-mode");
			regions.classList.toggle("dark-mode");

			search.classList.toggle("light-mode");
			search.classList.toggle("dark-mode");

			search.children[1].classList.toggle("light-mode");
			search.children[1].classList.toggle("dark-mode");

			for (let i = 0; i < countryList.children.length; i++) {
				countryList.children[i].classList.toggle("light-mode");
				countryList.children[i].classList.toggle("dark-mode");

				countryList.children[i].children[0].classList.toggle("light-mode");
				countryList.children[i].children[0].classList.toggle("dark-mode");

				countryList.children[i].children[1].children[0].classList.toggle(
					"light-mode"
				);
				countryList.children[i].children[1].children[0].classList.toggle(
					"dark-mode"
				);
			}
		}
	});
});
