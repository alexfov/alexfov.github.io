'use strict';

const player = ['Neeeeeerf', 102756891];
const games = JSON.parse(localStorage.getItem(`games_${player[0]}`)) || player_request('player');
const heroes = JSON.parse(localStorage.getItem(`heroes`)) || player_request();

const heroes_img = {};
for(let hero in heroes){
	heroes_img[heroes[hero]['localized_name']] = `https://api.opendota.com/apps/dota2/images/heroes/${heroes[hero].name.replace('npc_dota_hero_', '')}_full.png?`
}
console.log(heroes_img)

function player_request (what_request) {
	let request = new XMLHttpRequest();
	let obj = {};
	if(arguments[0] === 'player')
		request.open('GET', `https://api.opendota.com/api/players/${player[1]}/matches`, false);
	else request.open('GET', `https://api.opendota.com/api/heroes`, false);
	request.send();
	obj = JSON.parse(request.responseText);
	return obj;
}

function foldArray (arr){
	let obj = [];
	let prev_month = (new Date(games[0].start_time * 1000)).getMonth() + 1;
	let index_start = 0, index_end = 1;

	for (let i = 1; i < games.length; i++) {
		let month = (new Date(games[i].start_time * 1000)).getMonth() + 1;
		if(month !== prev_month){
			index_end = i;
			obj.push(arr.slice(index_start, index_end));
			index_start = i; 
			if(obj.length === 12) break;
		}
		prev_month = month;
	}

	return obj;
}

let last_year_games = foldArray(games).reverse();
console.log(last_year_games);

let last_year_wins = [];

class PopupData{
	constructor(arr){
		this.games = arr.map(x => x.length);
		this.wr = arr
								.map((x, i) => 
															x.filter((x) => isPlayerWin(x)).length 
															/ this.games[i] * 100)
								.map(x => ~~(x * 10) /10);

		this.heroes = [];
		arr.forEach(x => this.heroes.push(heroesMap(x)));

		this.favourite_hero =  [];
		this.best_hero = [];
		this.worst_hero = [];
		this.heroes.forEach(x => {
			this.favourite_hero.push(favourite_hero(x)[0]);
			this.best_hero.push(favourite_hero(x)[1]);
			this.worst_hero.push(favourite_hero(x)[2]);
		});
	}
}

let player_year_stats = new PopupData(last_year_games);
console.log(player_year_stats);

function heroesMap (arr) {
	let obj = {};
	for (let i = 0; i < arr.length; i++) {
		let cur_hero = printHeroName(arr[i]);
		if(!(cur_hero in obj)){
			obj[cur_hero] = [1, 0];
		}
		else obj[cur_hero][0]++;
		if(isPlayerWin(arr[i]))
			obj[cur_hero][1] ++;
	}
	return obj;
}

function favourite_hero (obj) {
	let max_matches = 0;
	let fav_hero = '';
	let best_hero = null;
	let best_hero_wr = 0;
	let worst_hero = null;
	let worst_hero_wr = 100;

	for(let hero in obj){
		let games_on_hero = obj[hero][0];
		let wins_on_hero = obj[hero][1];
		let wr = wins_on_hero / games_on_hero;

		if(games_on_hero > max_matches){
			max_matches = games_on_hero;
			fav_hero = hero;
		}

		if(games_on_hero >= 4){
			if(wr > best_hero_wr){
				best_hero_wr = wr;
				best_hero = hero;
			}

			if(wr < worst_hero_wr){
				worst_hero_wr = wr;
				worst_hero = hero;
			}
		}
	}
	if(best_hero === worst_hero) worst_hero = null;
	return [fav_hero, best_hero, worst_hero];
}

console.log(favourite_hero(player_year_stats.heroes[0]))