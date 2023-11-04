'use strict';

const player = ['Roman', 127761457];
const games = JSON.parse(localStorage.getItem(`games_${player[0]}`)) || player_request('player');
const heroes = JSON.parse(localStorage.getItem(`heroes`)) || player_request();

const heroes_img = {};
for(let hero in heroes){
	heroes_img[heroes[hero]['localized_name']] = `https://api.opendota.com/apps/dota2/images/heroes/${heroes[hero].name.replace('npc_dota_hero_', '')}_full.png?`
}

let last_year_games = foldArray(games).reverse();
let player_year_stats = new PopupData(last_year_games);
