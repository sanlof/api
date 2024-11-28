/* Pokémon API = https://pokeapi.co/api/v2/{endpoint}/ */

const pokedex = document.getElementById('pokedex'); // hitta pokédex-diven

fetch('https://pokeapi.co/api/v2/pokemon?limit=151') // väljer endpoint pokémon och begränsar mig till första generationen som omfattar de första 150, från bulbasaur (1) till mew (151)
.then(response => response.json())
.then(data => {
    fetchAllPokemon = data.results;
    console.log(data.results); // såhär kan jag kolla vad api:n innehåller via dev tools

    const pokemons = data.results; // här sparas alla pokémon i en array

    // här loopar jag alla pokémon från arrayen
    pokemons.forEach(pokemon => { 

        const pokediv = document.createElement('div'); // skapar ett div-element för varje pokémon
        pokediv.setAttribute('id', pokemon.name); // ger diven pokemonens namn som id
        pokediv.classList.add('poke-div'); // ger diven en class så man kan appenda mer data i senare
        
        const btnOpen = document.getElementById('open');
        const btnClose = document.getElementById('close');
        
        btnOpen.addEventListener('click', () => { 
            pokedex.appendChild(pokediv); // appendar div-elementen till pokédex-div (öppna)
            btnOpen.style.display = "none";
            btnClose.style.display = "block";
        });        
        btnClose.addEventListener('click', () => { 
            pokedex.removeChild(pokediv); // tar bort div-elementen från pokédex-div (stäng)
            btnClose.style.display = "none";
            btnOpen.style.display = "block";
        });
        
        const pokemonURL = `${pokemon.url}`; // url till pokémonens egna api (med fler egenskaper)

        const getPokemon = async (pokemon) => {
            try {
                const response = await fetch(pokemonURL);
                const pokemonData = await response.json();
                console.log(pokemonData); // så jag kan kolla api:ns innehåll via dev tools

                const poke_data_div = document.createElement('div'); // skapa ett div-element
                poke_data_div.classList.add('poke-data-div'); // ge div en class
                poke_data_div.innerHTML = `
                <img src="${pokemonData.sprites.front_default}" />
                <img src="${pokemonData.sprites.back_default}" />
                <h2>no ${pokemonData.id} ${pokemonData.name}</h2>
                <p>no ${pokemonData.id}</p>
                <audio id="player-${pokemonData.id}" src="${pokemonData.cries.legacy}" type="audio/ogg"></audio>
                <button onclick="document.getElementById('player-${pokemonData.id}').play()">Rawr!</button>
                `;

                pokediv.appendChild(poke_data_div);

            } catch (error) {
                console.error(error);
            }
        };

        getPokemon();
        

    }); //close foreach
}) .catch(error => {
    console.error('Error fetching data:', error);
});
