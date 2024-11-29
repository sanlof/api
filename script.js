/* Pokémon API = https://pokeapi.co/api/v2/{endpoint}/ */

const pokedex = document.getElementById('pokedex'); // hitta pokédex-diven
const pokemon_list = document.getElementById('pokemon-list'); // hitta pokédex-diven
const checkbox_pokemon = document.getElementById('checkbox-pokemon'); // alternativ pokémon
const checkbox_items = document.getElementById('checkbox-items'); // alternativ items
const btnFetch = document.getElementById('fetchButton');

btnFetch.addEventListener('click', (event) => {
    event.preventDefault(); // förhindra att sidan uppdateras när man skickar formuläret
    pokemon_list.innerHTML = ''; // töm listan ifall man avmarkerat något alternativ

if (checkbox_pokemon.checked) {

    fetch('https://pokeapi.co/api/v2/pokemon?limit=151') // väljer endpoint pokémon och begränsar mig till första generationen som omfattar de första 150, från bulbasaur (1) till mew (151)
    .then((response) => response.json())
    .then((data) => {
        fetchAllPokemon = data.results;
        console.log(data.results); // såhär kan jag kolla vad api:n innehåller via dev tools
    
        const pokemons = data.results; // här sparas alla pokémon i en array
    
        // här loopar jag alla pokémon från arrayen
        pokemons.forEach(pokemon => { 
    
            const pokemon_li = document.createElement('li'); // skapar ett div-element för varje pokémon
            
            pokemon_list.appendChild(pokemon_li); // appendar div-elementen till pokédex-div (öppna)
            
            const pokemonURL = `${pokemon.url}`; // url till pokémonens egna api (med fler egenskaper)
    
            const getPokemon = async (pokemon) => {
                try {
                    const response = await fetch(pokemonURL);
                    const pokemonData = await response.json();
                    console.log(pokemonData); // så jag kan kolla api:ns innehåll via dev tools
    
                    const poke_data_li = document.createElement('div'); // skapa ett div-element
                    poke_data_li.classList.add('poke-data-div'); // ge div en class
                    poke_data_li.innerHTML = `
                    <img src="${pokemonData.sprites.front_default}" id="${pokemonData.name}" alt="${pokemonData.name}" title="${pokemonData.name}" />
                    `;
    
                    pokemon_li.appendChild(poke_data_li);
    
                    const poke_data_div = document.createElement('div'); // skapa ett div-element
                    const poke_type = pokemonData.types["0"]["type"]["name"];
                    poke_data_div.classList.add(`${poke_type}`); // ge div en class
                    poke_data_div.innerHTML = `
                    <img src="${pokemonData.sprites.other.home.front_default}" alt="${pokemonData.name}" title="${pokemonData.name}" />
                    <h2>no ${pokemonData.id} ${pokemonData.name}</h2>
                    <p>no ${pokemonData.id}</p>
                    <audio id="player-${pokemonData.id}" src="${pokemonData.cries.legacy}" type="audio/ogg"></audio>
                    <button onclick="document.getElementById('player-${pokemonData.id}').play()">Rawr!</button>
                    `;
                    // pokedex.appendChild(poke_data_div); UTKOMMENTERAD FÖR VILL ATT MENY SKA FUNKA
    
                    document.body.addEventListener('click', (event) => {
                        if (event.target.id === pokemonData.name) {
                            const pokedex = document.getElementById('pokedex');
                            pokedex.innerHTML = '';
                            pokedex.appendChild(poke_data_div);
                        }
                    });
    
    
                } catch (error) {
                    console.error(error);
                }
            };
    
            getPokemon();
            
    
        }); //close foreach
    }) .catch(error => {
        console.error('Error fetching data:', error);
    });

}

if (checkbox_items.checked) {
        fetch('https://pokeapi.co/api/v2/item') // väljer ny endpoint items
        .then((response) => response.json())
        .then((data) => {
        fetchAllItems = data.results;
        console.log(data.results); // såhär kan jag kolla vad api:n innehåller via dev tools
        const items = data.results; // här sparas alla items i en array

        items.forEach(item => { 
            const item_li = document.createElement('li'); // skapar ett li-element för varje item
            pokemon_list.appendChild(item_li); // appendar li-elementen till menyn
            
            const itemURL = `${item.url}`; // url till itemets egna api (med fler egenskaper)

            const getItem = async (item) => {
                try {
                    const response = await fetch(itemURL);
                    const itemData = await response.json();
                    console.log(itemData); // så jag kan kolla api:ns innehåll via dev tools
    
                    const item_data_li = document.createElement('div'); // skapa ett div-element
                    item_data_li.classList.add('poke-data-div'); // ge div en class
                    item_data_li.innerHTML = `
                    <img id="${itemData.name}" src="${itemData.sprites.default}" alt="${itemData.name}" title="${itemData.name}">
                    
                    `;
    
                    item_li.appendChild(item_data_li);
    
                    const poke_data_div = document.createElement('div'); // skapa ett div-element
                    poke_data_div.classList.add('poke-data-div'); // ge div en class
                    poke_data_div.innerHTML = `
                    <h2>no ${itemData.id} ${itemData.name}</h2>
                    <img src="${itemData.sprites.default}" alt="${itemData.name}" title="${itemData.name}">
                    <p>${itemData.flavor_text_entries[1].text}</p>
                    `;
                    // pokedex.appendChild(poke_data_div); UTKOMMENTERAD FÖR VILL ATT MENY SKA FUNKA
    
                    document.body.addEventListener('click', (event) => {
                        if (event.target.id === itemData.name) {
                            const pokedex = document.getElementById('pokedex');
                            pokedex.innerHTML = '';
                            pokedex.appendChild(poke_data_div);
                        }
                    });
    
    
                } catch (error) {
                    console.error(error);
                }
            };
    
            getItem();

        });
    });
}


}); //end button