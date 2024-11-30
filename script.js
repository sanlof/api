/* Pokémon API = https://pokeapi.co/api/v2/{endpoint}/ */

const pokedex = document.getElementById('pokedex'); // hitta pokédex-diven
const menu_list = document.getElementById('menu-list'); // hitta pokédex-diven
const checkbox_pokemon = document.getElementById('checkbox-pokemon'); // alternativ pokémon
const checkbox_items = document.getElementById('checkbox-items'); // alternativ items
const btnFetch = document.getElementById('fetchButton');

btnFetch.addEventListener('click', (event) => {
    event.preventDefault(); // förhindra att sidan uppdateras när man skickar formuläret
    menu_list.innerHTML = ''; // töm listan ifall man avmarkerat något alternativ

if (checkbox_pokemon.checked) {

    fetch('https://pokeapi.co/api/v2/pokemon?limit=151') // väljer endpoint pokémon och begränsar mig till första generationen som omfattar de första 150, från bulbasaur (1) till mew (151)
    .then((response) => response.json())
    .then((data) => {
        fetchAllPokemon = data.results;
        console.log(data.results); // såhär kan jag kolla vad api:n innehåller via dev tools
    
        const pokemons = data.results; // här sparas alla pokémon i en array
    
        // här loopar jag alla pokémon från arrayen
        pokemons.forEach(pokemon => { 
    
            const pokemon_li = document.createElement('li'); // skapar ett list-element för varje pokémon
            pokemon_li.setAttribute('id', pokemon.name); // ge list-elementet pokemons namn som id
            menu_list.appendChild(pokemon_li); // appendar list-elementen till menu-listan
            
            const pokemonURL = `${pokemon.url}`; // url till pokémonens egna api (med fler egenskaper)
    
            const getPokemon = async (pokemon) => {
                try {
                    const response = await fetch(pokemonURL);
                    const pokemonData = await response.json();
                    console.log(pokemonData); // så jag kan kolla api:ns innehåll via dev tools

                    let pokemon = { // spara ner pokemon-datan i enklare variabler
                        id:`${pokemonData.id}`,
                        name: `${pokemonData.name}`,
                        type: `${pokemonData.types["0"]["type"]["name"]}`,
                        thumbnail: `${pokemonData.sprites.front_default}`,
                        image: `${pokemonData.sprites.other.home.front_default}`,
                        hp: `${pokemonData.stats[0].base_stat}`,
                        attack: `${pokemonData.stats[1].base_stat}`,
                        defense: `${pokemonData.stats[2].base_stat}`,
                        speed: `${pokemonData.stats[5].base_stat}`,
                        xp: `${pokemonData.base_experience}`
                    }

                    /***** innehåll till menu-list *****/
    
                    const pokemon_thumbnail = document.createElement('div'); // skapa ett div-element
                    pokemon_thumbnail.classList.add('thumbnail'); // ge div en class
                    pokemon_thumbnail.innerHTML = `
                    <img src="${pokemon.thumbnail}" 
                        id="${pokemon.name}" 
                        alt="${pokemon.name}" 
                        title="${pokemon.name}" 
                    />`;
    
                    pokemon_li.appendChild(pokemon_thumbnail); // lägg till div med innehåll till list-elementet (testade att lägga till direkt i li men då hamnade pokemon hullerombuller i listan)


                    /******* innehåll till pokédex *******/
    
                    const pokemon_data = document.createElement('article'); // skapa ett div-element
                    pokemon_data.classList.add('pokemon-data'); // class för overall styling
                    pokemon_data.classList.add(`${pokemon.type}`); // class för styling utifrån pokémons typ
                    pokemon_data.setAttribute('id', pokemon.name); // id utifrån namn ifall vi vill styla något på en särskild pokémon

                    // räkna om stats till procent
                    let hpPercentage = calcStatPercentage(pokemon.hp,250); //chansey
                    let attackPercentage = calcStatPercentage(pokemon.attack, 134); //dragonite
                    let defensePercentage = calcStatPercentage(pokemon.defense, 180); //cloyster
                    let speedPercentage = calcStatPercentage(pokemon.speed, 140); //electrode
                    let xpPercentage = calcStatPercentage(pokemon.xp, 340); //mewtwo
                    function calcStatPercentage(currentStat,maxStat) {
                        let statPercentage = (currentStat / maxStat) * 100;
                        return statPercentage;
                    }

                    pokemon_data.innerHTML = `
                    <img src="${pokemon.image}" alt="${pokemon.name}" />
                    <h2>${pokemon.name}</h2>
                    <p>N° ${pokemon.id}</p>
                    <p>${pokemon.type}</p>
                    <section class="stats">
                        <div>
                            <p>${pokemonData.stats[0].stat.name}</p>
                            <p class="stat-bar" style="width:${hpPercentage}%;">&nbsp;</p>
                            <p>${pokemon.hp}</p>
                        </div>
                        <div>
                            <p>${pokemonData.stats[1].stat.name}</p>
                            <p class="stat-bar" style="width:${attackPercentage}%;">&nbsp;</p>
                            <p>${pokemon.attack}</p>
                        </div>
                        <div>
                            <p>${pokemonData.stats[2].stat.name}</p>
                            <p class="stat-bar" style="width:${defensePercentage}%;">&nbsp;</p>
                            <p>${pokemon.defense}</p>
                        </div>
                        <div>
                            <p>${pokemonData.stats[5].stat.name}</p>
                            <p class="stat-bar" style="width:${speedPercentage}%;">&nbsp;</p>
                            <p>${pokemon.speed}</p>
                        </div>
                        <div>
                            <p>XP</p>
                            <p class="stat-bar" style="width:${xpPercentage}%;">&nbsp;</p>
                            <p>${pokemon.xp}</p>
                        </div>
                    </section>
                    <audio id="player-${pokemonData.id}" src="${pokemonData.cries.legacy}" type="audio/ogg"></audio>
                    <button onclick="document.getElementById('player-${pokemonData.id}').play()">Rawr!</button>
                    `;

                    // pokedex.appendChild(pokemon_thumbnail); UTKOMMENTERAD FÖR VILL ATT MENY SKA FUNKA
    
                    document.body.addEventListener('click', (event) => {
                        if (event.target.id === pokemon.name) {
                            const pokedex = document.getElementById('pokedex');
                            pokedex.innerHTML = '';
                            pokedex.appendChild(pokemon_data);
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
            menu_list.appendChild(item_li); // appendar li-elementen till menyn
            
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
    
                    const pokemon_data = document.createElement('div'); // skapa ett div-element
                    pokemon_data.classList.add('poke-data'); // ge div en class
                    pokemon_data.innerHTML = `
                    <h2>no ${itemData.id} ${itemData.name}</h2>
                    <img src="${itemData.sprites.default}" alt="${itemData.name}" title="${itemData.name}">
                    <p>${itemData.flavor_text_entries[1].text}</p>
                    `;
                    // pokedex.appendChild(pokemon_data); UTKOMMENTERAD FÖR VILL ATT MENY SKA FUNKA
    
                    document.body.addEventListener('click', (event) => {
                        if (event.target.id === itemData.name) {
                            const pokedex = document.getElementById('pokedex');
                            pokedex.innerHTML = '';
                            pokedex.appendChild(pokemon_data);
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