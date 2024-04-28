'use strict';

const player = ['BloOdTerrOr', 120491980];
const games = JSON.parse(localStorage.getItem(`games_${player[0]}`)) || player_request('player');
const heroes = JSON.parse(localStorage.getItem(`heroes`)) || player_request();

const heroes_img = {};
for(let hero in heroes){
	heroes_img[heroes[hero]['localized_name']] = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroes[hero].name.replace('npc_dota_hero_', '')}.png?`
	console.log(`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroes[hero].name.replace('npc_dota_hero_', '')}.png?`)
}

let last_year_games = foldArray(games).reverse();
let player_year_stats = new PopupData(last_year_games);
