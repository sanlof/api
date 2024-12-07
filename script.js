/* Pokémon API = https://pokeapi.co/api/v2/{endpoint}/ */

const checkbox_pokemon = document.getElementById('checkbox-pokemon'); // endpoint pokémon
const checkbox_items = document.getElementById('checkbox-items'); // endpoint items
const btnFetch = document.getElementById('fetchButton'); // hämta api-data

const pokedex = document.getElementById('pokedex'); // hitta pokédex-diven
const pokedex_info = document.getElementById('pokedex-info'); // div för pokemon/item-data


const fetchData = async url => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data; 
    }  catch (error) {
        console.error(error);   
    }
}

btnFetch.addEventListener('click', async (event) => {
    event.preventDefault(); // förhindra att sidan uppdateras när man skickar formuläret
    pokedex.innerHTML = ''; // töm listan ifall man avmarkerat något alternativ

    if (checkbox_pokemon.checked) {
        const data = await fetchData('https://pokeapi.co/api/v2/pokemon?limit=151');
        const pokemons = data.results; // pokemons sparas i en array

        for (const pokemon of pokemons) { // loopa in alla pokémon från arrayen
            const pokemonData = await fetchData(`${pokemon.url}`);
            console.log(pokemonData);

            const pokemon_article = document.createElement('article'); // skapa en article för varje pokémon
            pokemon_article.setAttribute('id', pokemon.name); // ge article pokémons namn som id
            pokedex.appendChild(pokemon_article); // appenda article till pokédex

            const pokemonDetails = { 
                id: pokemonData.id,
                name: pokemonData.name,
                type: pokemonData.types["0"]["type"]["name"],
                thumbnail: pokemonData.sprites.front_default,
                thumbnail2: pokemonData.sprites.back_default,
                image: pokemonData.sprites.other.dream_world.front_default,
                hp: pokemonData.stats[0].base_stat,
                attack: pokemonData.stats[1].base_stat,
                defense: pokemonData.stats[2].base_stat,
                speed: pokemonData.stats[5].base_stat,
                xp: pokemonData.base_experience
            };

            /***** innehåll till pokédex *****/
            pokemon_article.classList.add(pokemonDetails.type); 
            pokemon_article.innerHTML += `
                <img src="${pokemonDetails.thumbnail}" 
                     id="${pokemon.name}" 
                     alt="${pokemon.name}" 
                     title="${pokemon.name}" />
            `;

            /******* innehåll till pokémon *******/
            const pokemon_data = document.createElement('article');  // skapa en article
            addPokemonContent(pokemon_data, pokemonDetails, pokemonData); // funktion för att lägga till datan
            pokedexClick(pokedex_info, pokemon_data, pokemon.name); // klicka för att visa pokémonens data

        } // end loop
    } // end if

    if (checkbox_items.checked) {
    
        const data = await fetchData('https://pokeapi.co/api/v2/item');
        const items = data.results;

        for (const item of items) { // loopa in alla pokémon från arrayen
            const itemData = await fetchData(`${item.url}`);
            console.log(itemData);

            const item_article = document.createElement('article'); // skapar en article för varje item
            item_article.setAttribute('id', item.name); // ge article pokémons namn som id
            pokedex.appendChild(item_article); // appendar item-articles till pokédex
            
            const itemDataName = itemData.name.replace(/-/g, " ");

            item_article.innerHTML = `
            <img id="${itemData.name}" src="${itemData.sprites.default}" alt="${itemDataName}" title="${itemDataName}">
            `;

            /******* innehåll till pokémon *******/
            const item_data = document.createElement('article');  // skapa en article
            addItemContent(item_data, itemData, itemDataName); // funktion för att lägga till datan
            pokedexClick(pokedex_info, item_data, item.name); // klicka för att visa items data

        } // end loop
    } // end if

}); //end button

function pokedexClick(pokedex_info, data, name) {
    document.body.addEventListener('click', (event) => {
        if (event.target.id === name) {
            pokedex_info.innerHTML = '';
            pokedex_info.appendChild(data);
        } else if (event.target.id === 'close') {
            pokedex_info.innerHTML = '';
        }
    });
}


const idsToHide = ['checkbox-pokemon', 'label-pokemon', 'checkbox-items', 'label-items'];
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;

    idsToHide.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (scrollPosition > 5) {
                element.classList.add('hidden');  // Fade out the element
            } else {
                element.classList.remove('hidden');  // Fade in the element
            }
        }
    });
});


const addPokemonContent = (pokemon_data, pokemon, pokemonData) => {

    // räkna om stats till procent
    let hpPercentage = calcStatPercentage(pokemon.hp, 250); //chansey
    let attackPercentage = calcStatPercentage(pokemon.attack, 134); //dragonite
    let defensePercentage = calcStatPercentage(pokemon.defense, 180); //cloyster
    let speedPercentage = calcStatPercentage(pokemon.speed, 140); //electrode
    let xpPercentage = calcStatPercentage(pokemon.xp, 395); //chansey
    function calcStatPercentage(currentStat,maxStat) {
        let statPercentage = (currentStat / maxStat) * 100;
        return Math.round(statPercentage);
    }

    pokemon_data.classList.add('pokemon-data'); // ge class för overall styling
    pokemon_data.classList.add(`${pokemon.type}`); // ge class för styling utifrån pokémons typ
    pokemon_data.setAttribute('id', pokemon.name); // ge id utifrån namn för styling på en viss pokémon
    pokemon_data.innerHTML = `
    <button id="close">Close</button>
    <hgroup>
        <h2>${pokemon.name}</h2>
        <p class="id-no">N° ${pokemon.id}</p>
    </hgroup>
    <img src="${pokemon.image}" alt="${pokemon.name}"
    onclick="document.getElementById('player-${pokemonData.id}').play()" />
    <section class="stats">
        <div id="hp">
            <p>${pokemonData.stats[0].stat.name}</p>
            <div class="stat-bar">
                <div style="width:${hpPercentage}%;"></div>
            </div>
            <p>${pokemon.hp}</p>
            </div>
        <div id="attack">
            <p>${pokemonData.stats[1].stat.name}</p>
            <div class="stat-bar">
                <div style="width:${attackPercentage}%;"></div>
            </div>
            <p>${pokemon.attack}</p>
        </div>
        <div id="defense">
            <p>${pokemonData.stats[2].stat.name}</p>
            <div class="stat-bar">
                <div style="width:${defensePercentage}%;"></div>
            </div>
            <p>${pokemon.defense}</p>
        </div>
        <div id="speed">
            <p>${pokemonData.stats[5].stat.name}</p>
            <div class="stat-bar">
                <div style="width:${speedPercentage}%;"></div>
            </div>
            <p>${pokemon.speed}</p>
        </div>
        <div id="xp">
            <p>XP</p>
            <div class="stat-bar">
                <div style="width:${xpPercentage}%;"></div>
            </div>
            <p>${pokemon.xp}</p>
        </div>
        <p class="type"></p>
    </section>
    `;
    if (pokemon.name === 'jigglypuff') {
        pokemon_data.innerHTML += `
        <audio id="player-${pokemonData.id}" src="audio/jigglypuff.mp3" type="audio/ogg"></audio>
        `;
    } else if (pokemon.name === 'pikachu') {
        pokemon_data.innerHTML += `
        <audio id="player-${pokemonData.id}" src="audio/pikachu.mp3" type="audio/ogg"></audio>
        `;
    } else {
        pokemon_data.innerHTML += `
        <audio id="player-${pokemonData.id}" src="${pokemonData.cries.legacy}" type="audio/ogg"></audio>
        `;
    }
}

const addItemContent = (item_data, itemData, itemDataName) => {
    item_data.classList.add('item-data'); // ge article en class för styling
    item_data.setAttribute('id', itemData.name); // ge article items namn som id för styling
    item_data.innerHTML = `
    <button id="close">Close</button>
    <hgroup>
        <h2>${itemDataName}</h2>
        <p>no ${itemData.id}</p>
    </hgroup>
    <img src="${itemData.sprites.default}" alt="${itemData.name}" title="${itemData.name}">
    <section class="stats">
        <p>${itemData.flavor_text_entries[1].text}</p>
    </section>
    `;
}