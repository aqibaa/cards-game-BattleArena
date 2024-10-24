
import heroesData from './heroes.js'; // Adjust the path as necessary

let heroes = []; // This will hold the hero data

document.addEventListener("DOMContentLoaded", () => {
    loadHeroes();
    setupEventListeners();
});

document.getElementById("refresh-button").addEventListener("click", () => {
    location.reload()
})
// Function to load heroes from the data file
function loadHeroes() {
    heroes = heroesData; // Use the selection count


    function shuffleArray(heroes) {
        for (let i = heroes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [heroes[i], heroes[j]] = [heroes[j], heroes[i]];
        }
        return heroes;
    }

    displayHeroes(shuffleArray(heroes).slice(0, 900));  // Show limited heroes for the booster pack
    // Initially display all heroes

    populateRaceOptions();  // Populate race filter dropdown
}



function calculateHeroStats(hero) {
    const attack = Math.ceil((hero.powerstats.strength + hero.powerstats.combat + hero.powerstats.power) / 30);
    const defense = Math.ceil((hero.powerstats.intelligence + hero.powerstats.durability + hero.powerstats.speed) / 30);
    const priority = Math.ceil((hero.appearance.weight + hero.appearance.height) / 50);
    const cost = Math.ceil(attack + defense + priority);
    return { attack, defense, priority, cost };
}

// Function to display heroes in cards
function displayHeroes(heroList) {
    const heroListContainer = document.getElementById("hero-list");
    heroListContainer.innerHTML = ""; // Clear previous list

    heroList.forEach(hero => {
        const heroStats = calculateHeroStats(hero); // Calculate the stats
        const heroCard = document.createElement("div");
        heroCard.classList.add("card", "col-lg-4", "mt-4", "m-auto", "shadow-lg", "cards", "hero-card");

        heroCard.innerHTML = `
            <div class='d-flex justify-content-between pt-2'>  
                <h5 class="card-title">${hero.name}</h5>
                <p class="card-text round p-1 cost">${heroStats.cost}</p>
            </div>
            <img src="${hero.image.url}" class ="card-img pt-2 " alt="...">
            <div class="card-body">
                <p class='card-text'><b>${hero.biography.alignment.toUpperCase()} / ${hero.appearance.race.toUpperCase()}</b></p>
                <p class="card-text d-flex justify-content-between m-0"><strong>Strength:</strong> ${hero.powerstats.strength}</p>
                <p class="card-text d-flex justify-content-between m-0"><strong>Power:</strong> ${hero.powerstats.power}</p>
                <p class="card-text d-flex justify-content-between m-0"><strong>Speed:</strong> ${hero.powerstats.speed}</p>
                <p class="card-text d-flex justify-content-between m-0"><strong>Intelligence:</strong> ${hero.powerstats.intelligence}</p>
                <p class="card-text d-flex justify-content-between m-0"><strong>Combat:</strong> ${hero.powerstats.combat}</p>
                <p class="card-text d-flex justify-content-between m-0"><strong>Durability:</strong> ${hero.powerstats.durability}</p>                
            </div>
            <div class='d-flex justify-content-between'>
                <p class="card-text"><b class='priority'>${heroStats.priority}</b></p>
                <p class="card-text"><b class='attack'>${heroStats.attack}</b> /<b class='defense'> ${heroStats.defense}</b></p>
            </div>
        `;

        heroCard.addEventListener("mouseenter", () => {
            heroCard.style.border = "2px solid gold";
            heroCard.style.color = "gold";
        });

        heroCard.addEventListener("mouseleave", () => {
            heroCard.style.border = "";
            heroCard.style.color = "";
        });

        heroListContainer.appendChild(heroCard);
    });
}

// Function to get unique races and create options dynamically
function populateRaceOptions() {
    const raceSelect = document.getElementById('race-select');
    const raceOptions = [...new Set(heroesData.map(hero => hero.appearance.race))];
    raceOptions.forEach(race => {
        const option = document.createElement('option');
        option.value = race;
        option.textContent = race;
        raceSelect.appendChild(option);
    });
}

// Function to filter heroes by race, name, and alignment
function filterHeroes() {
    const searchValue = document.getElementById("search-input").value.toLowerCase();
    const raceValue = document.getElementById("race-select").value;
    const alignmentValue = document.getElementById("alignment-filter").value;
    const sortValue = document.getElementById("sort-select").value;

    let filteredHeroes = heroes.filter(hero => {
        const matchesName = hero.name.toLowerCase().includes(searchValue);
        const matchesRace = raceValue ? hero.appearance.race === raceValue : true;
        const matchesAlignment = alignmentValue ? hero.biography.alignment === alignmentValue : true;
        return matchesName && matchesRace && matchesAlignment;
    });

    // Sort heroes based on the selected sorting criteria
    if (sortValue === "name-asc") {
        filteredHeroes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "name-desc") {
        filteredHeroes.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortValue === "id-asc") {
        filteredHeroes.sort((a, b) => a.id - b.id);
    } else if (sortValue === "id-desc") {
        filteredHeroes.sort((a, b) => b.id - a.id);
    }

    displayHeroes(filteredHeroes);
}

// Set up event listeners
function setupEventListeners() {
    document.getElementById("search-input").addEventListener("input", filterHeroes);
    document.getElementById("race-select").addEventListener("change", filterHeroes);
    document.getElementById("alignment-filter").addEventListener("change", filterHeroes);
    document.getElementById("sort-select").addEventListener("change", filterHeroes);
}

