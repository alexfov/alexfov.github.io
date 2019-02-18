let isGameFinished = 0;

HTMLAudioElement.prototype.stop = function(){
	this.pause();
	this.currentTime = 0.0;
}

Array.prototype.last = function() {
	return this[this.length - 1];
}

//запрет перемещения фото
$("body").on("dragstart", () => false);

class Sounds {
	constructor(obj){
		for(let elem in obj){
			let sound = new Audio;
			sound.src = obj[elem];
			this[elem] = sound;
		}
	}
}

const sounds_map = {
	wrong: "sound/wrong.mp3",
	beep: 'sound/beep.mp3', 
	aplause: 'sound/aplause.mp3',
}

const sounds = new Sounds(sounds_map);

const city_birds = [
	['img/birds/city/bullfinch.jpg', 0, "Снегирь"],
	['img/birds/city/dove.jpg', 1, "Голубь"],
	['img/birds/city/goldfinch.jpg', 2, "Щегол"],
	['img/birds/city/jay.jpg', 3, "Сойка"],
	['img/birds/city/magpie.jpg', 4, "Сорока"],
	['img/birds/city/raven.jpg', 5, "Ворона"],
	['img/birds/city/schur.jpg', 6, "Щур"],
	['img/birds/city/sparrow.jpg', 7, "Воробей"],
	['img/birds/city/thrush.jpg', 8, "Дрозд"],
	['img/birds/city/tit.jpg', 9, "Синица"],
	['img/birds/city/result.jpg', 'result', 'Проверим знания? Нажми на кнопку.']
];

const forest_birds = [
	['img/birds/forest/black_grouse.jpg', 0, "Тетерев"],
	['img/birds/forest/cuckoo.jpg', 1, "Кукушка"],
	['img/birds/forest/eagle.jpg', 2, "Орел"],
	['img/birds/forest/hawk.jpg', 3, "Сокол"],
	['img/birds/forest/lentils.jpg', 4, "Чечевица"],
	['img/birds/forest/owl.jpg', 5, "Сова"],
	['img/birds/forest/siskin.jpg', 6, "Чиж"],
	['img/birds/forest/starling.jpg', 7, "Скворец"],
	['img/birds/forest/swift.jpg', 8, "Стриж"],
	['img/birds/forest/woodpecker.jpg', 9, "Дятел"],
	['img/birds/forest/result.jpg', 'result', 'Проверим знания? Нажми на кнопку.']
];

const predators = [
	['img/animals/predators/bars.jpg', 0, "Барс"],
	['img/animals/predators/bear-brown.jpg', 1, "Бурый медведь", "sound/predators/bear.mp3"],
	['img/animals/predators/black-panther.jpg', 2, "Черная пантера", "sound/predators/leopard.mp3"],
	['img/animals/predators/hyena.jpg', 3, "Гиена", "sound/predators/hyena.mp3"],
	['img/animals/predators/leopard.jpg', 4, "Леопард", "sound/predators/leopard.mp3"],
	['img/animals/predators/lion.jpg', 5, "Лев", "sound/predators/lion.mp3"],
	['img/animals/predators/lynx.jpg', 6, "Рысь", "sound/predators/lynx.mp3"],
	['img/animals/predators/polar-bear.jpg', 7, "Белый медведь", "sound/predators/bear.mp3"],
	['img/animals/predators/puma.jpg', 8, "Пума", "sound/predators/puma.mp3"],
	['img/animals/predators/tiger.jpg', 9, "Тигр", "sound/predators/tiger.mp3"],
	['img/animals/predators/wolf.jpg', 10, "Волк", "sound/predators/wolf.mp3"],
	['img/animals/predators/manus.jpg', 11, "Манул", "sound/predators/manus.mp3"],
	['img/animals/predators/result.jpg', 'result', 'Проверим знания? Нажми на кнопку.']
];

const herbivorous = [
	['img/animals/herbivorous/beaver.jpg', 0, "Бобер"],
	['img/animals/herbivorous/boar.jpg', 1, "Кабан"],
	['img/animals/herbivorous/chipmunk.jpg', 2, "Бурундук"],
	['img/animals/herbivorous/deer.jpg', 3, "Олень"],
	['img/animals/herbivorous/hare.jpg', 4, "Заяц"],
	['img/animals/herbivorous/hedgehog.jpg', 5, "Ёж"],
	['img/animals/herbivorous/moose.jpg', 6, "Лось"],
	['img/animals/herbivorous/mouse.jpg', 7, "Мышь"],
	['img/animals/herbivorous/roe_deer.jpg', 8, "Косуля"],
	['img/animals/herbivorous/squirrel.jpg', 9, "Белка"],
	['img/animals/herbivorous/result.jpg', 'result', 'Проверим знания? Нажми на кнопку.']
];

const home = [
	['img/animals/home/sheep.jpg', 0, "Овца"],
	['img/animals/home/cat.jpg', 1, "Кошка"],
	['img/animals/home/chiken.jpg', 2, "Курица"],
	['img/animals/home/cow.jpg', 3, "Корова"],
	['img/animals/home/dog.jpg', 4, "Собака"],
	['img/animals/home/donkey.jpg', 5, "Осел"],
	['img/animals/home/goat.jpg', 6, "Коза"],
	['img/animals/home/goose.jpg', 7, "Гусь"],
	['img/animals/home/horse.jpg', 8, "Лошадь"],
	['img/animals/home/pig.jpg', 9, "Свинья"],
	['img/animals/home/ram.jpg', 10, "Баран"],
	['img/animals/home/result.jpg', 'result', 'Проверим знания? Нажми на кнопку.']
];

const sea = [
	['img/sea/dolphin.jpg', 0, "Дельфин"],
	['img/sea/killer_whale.jpg', 1, "Касатка"],
	['img/sea/medusa.jpg', 2, "Медуза"],
	['img/sea/marlin.jpg', 3, "Рыба-меч"],
	['img/sea/moray_eel.jpg', 4, "Мурена"],
	['img/sea/navy_seal.jpg', 5, "Морской лев"],
	['img/sea/octopus.jpg', 6, "Осьминог"],
	['img/sea/penguin.jpg', 7, "Пингвин"],
	['img/sea/shark.jpg', 8, "Акула"],
	['img/sea/stingray.jpg', 9, "Скат"],
	['img/sea/turtle.jpg', 10, "Черепаха"],
	['img/sea/walrus.jpg', 11, "Морж"],
	['img/sea/whale.jpg', 12, "Кит"],
	['img/sea/result.jpg', 'result', 'Проверим знания? Нажми на кнопку.']
];

const insects = [
	['img/insects/bee.jpg', 0, 'Пчела', 'sound/insect/bee.mp3'],
	['img/insects/bumblebee.jpg', 1, 'Шмель', 'sound/insect/bumblebee.mp3'],
	['img/insects/butterfly.jpg', 2, 'Бабочка'],
	['img/insects/chafer.jpg', 3, 'Майский жук', 'sound/insect/chafer.mp3'],
	['img/insects/dragonfly.jpg', 4, 'Стрекоза', 'sound/insect/dragonfly.mp3'],
	['img/insects/fly.jpg', 5, 'Муха', 'sound/insect/fly.mp3'],
	['img/insects/ladybug.jpg', 6, 'Божья коровка'],
	['img/insects/mole.jpg', 7, 'Моль'],
	['img/insects/moscuito.jpg', 8, 'Комар', 'sound/insect/moscuito.mp3'],
	['img/insects/wasp.jpg', 9, 'Оса', 'sound/insect/wasp.mp3'],
	['img/insects/result.jpg', 'result', 'Проверим знания? Нажми на кнопку.']
];

const animals_maps = {
	forest_birds: forest_birds,
	city_birds: city_birds,
	predators: predators,
	herbivorous: herbivorous,
	home: home,
	sea: sea,
	insects: insects,
}

let slider_pos = 0;
function moveSlider (evt){
	let length = $('.slider__img-wrapper').length;
	if($(this).hasClass('slider__btn-right')){
		slider_pos = (slider_pos + 1) % length;
	}
	else{
		slider_pos--;
		if(slider_pos < 0) slider_pos = length - 1;
	}
	//показать смайлик(кнопка старта теста) на последнем слайде
	if(slider_pos === length - 1)
		$('.game__start-test').addClass('game__start-test_active');
	else $('.game__start-test').removeClass('game__start-test_active');

	$('.slider__wrapper').css('transform', `translateX(-${100 / length * slider_pos}%)`);
}

class Slider{
	constructor(group, game_node){
		this.animals = JSON.parse(JSON.stringify(group));
		this.game_node = $(game_node);

		for(const animal of this.animals){
			if(!animal[3]) continue;
			const audio = new Audio;
			audio.src = animal[3];
			animal.push(audio);
		};
	}

	sound(animal, sound_index = 4){
		if(animal == null) return;
		const cur_animal = this.animals[animal];
		//остановить все звуки животных
		this.animals.forEach(x => {
			if(x.length !== 5) return;
			x[sound_index].stop();
		});

		if(cur_animal.length !== 5) return;
		cur_animal[sound_index].play();

		return cur_animal[sound_index].duration;
	}

	makeSlider(){
		//воспроизвести звук у первого зверя, если он есть 
		if(this.animals[0].length === 5)
			this.sound(0);

		$('.slider').remove(); //удалить текущий слайдер с обработчиками
		const length = this.animals.length;
		const slider = $('<div>')
			.addClass('game__slider slider')
			.append($('<h2>').addClass('slider__animal-name').text(this.animals[0][2]))
			.append($('<div>').addClass('slider__btn slider__btn-left'))
			.append($('<div>').addClass('slider__btn slider__btn-right'))
			.append($('<div>').addClass('game__play').text('?'))
			.append($('<div>').html('<svg viewBox="0 0 436 467" class="game__start-test"><use href="#start-test" /></svg>'))
			.append($('<div>').addClass('slider__overflow')
		);

		const img_container = $('<div>')
			.addClass('slider__wrapper')
			.css('width', `${100 * length}%`)
			.appendTo(slider.children().last());

		for(let animal of this.animals){
			let element = $('<div>', {class: 'slider__img-wrapper'});
			element.append($('<img>', {src: `${animal[0]}`, 
																 class: 'slider__img',
																 alt: `${animal[2]}`
																 }));
			element.appendTo(img_container);
		}

		slider.appendTo(this.game_node);
		$('.slider__btn').on('click', moveSlider);
		$('.slider__btn').on('click', () =>{
			if(slider_pos !== this.animals.length - 1)
				this.sound(slider_pos);
			$('.slider__animal-name').text(this.animals[slider_pos][2]);
		});
		return this;
	}

	play(){
		const this_obj = this;
		const this_game_node = this.game_node;
		//Контейнер для задания
		$('.game__test-container').remove();
		const test_container = $('<div>').addClass('game__test-container');
		const test_question = $('<h2>').addClass('test-question');
		const test_body = $('<div>').addClass('game__test test');
		for (let i = 0; i < 4; i++)
			test_body.append($('<div>').addClass('test__img-container reset'));
		test_container.append(test_question).append(test_body);
		//Контейнер для результата теста
		const result = $('<div>').addClass('test__result result').css('background-image', `url(${this.animals.slice(-1)[0][0]})`);
		for (let i = 0; i < 3; i++){ //создать 3 звезды
			const svg_star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			const use_tag = document.createElementNS('http://www.w3.org/2000/svg', 'use');
			$(svg_star)
				.addClass('result__star')
				.append($(use_tag).attr('href', '#star'))

			if(i === 1) $(svg_star).addClass('result__star_higher');
			result.append($(svg_star));
		}
		this.game_node.append(test_container.append(result));
		
		let index = 0;
		let animals_list = this.animals; //ссылка на this
		let animals_arr =[];	//Текущий набор зверей (4шт) в тесте
		let answers = [0, 0]; //Подсчет верных ответов

		let count_result = (answers) => { //расчет награды за тест
			let wr = answers[1] / answers [0] * 100;
			let prize = 1;
			if(wr > 85) prize = 3;
			else if(wr > 70) prize = 2;
			return prize;
		}

		function randomNumber (arr, i, max) {//генератор зверей для вопроса.
			if(arr[i] == null){
				let random = ~~(Math.random() * max);
				if(arr.includes(random)) 
					randomNumber(arr, i, max);
				else
					arr[i] = random;
			}
			return arr;
		}

		function createBalloon (parent){ //Создание шарика
			for (let i = 0; i < 15; i++) { //15 шариков
				let balloon = $(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
				let use = $(document.createElementNS('http://www.w3.org/2000/svg', 'use'));
				balloon.addClass('balloon__item')
							 .css({left: `${~~(Math.random() * 87)}%`, //Случайное гориз. полож.
										//  fill: `rgb(${~~(Math.random() * 255)}, 
										//  						${~~(Math.random() * 255)}, 
										//  						${~~(Math.random() * 255)}` //Случ. цвет
										filter: `hue-rotate(${~~(Math.random() * 360)}deg)`
									 })
							 .append(use.addClass('balloon__item-path')
							 						.attr('href', '#balloon')
							 				)
				;
				setTimeout(() => 	$(parent).append(balloon), //Разброс по времени появления шариков
													~~(Math.random() * 7000));		
			}
		}

		function getElementsFromPoint(x, y) {
		  let element = 0, elements = []; // массив элементов под курсором
		  let start = performance.now()
		  while (performance.now() - start < 10) {
		    element = document.elementFromPoint(x, y); //Получить эл. под курсором.
		    if (!element || element.classList.contains('result'))
		      break; //если null или дошли до контейнера - остановить цикл
		    element.style.visibility = 'hidden'; //скрыть объект
		    elements.push(element); //добавить эл. в массив
		  }
		  for (const elem of elements)
		    elem.style.visibility = ''; //вернуть видимость объектов
		  return elements;
		}
	
		let timer = 1000; // задержка перед анимацией
		let build_task = (index) => {
			if(index === 1){ //this.animals.length - 1 все вопросы отвечены
				let prize = count_result(answers); //вызов функции расчета приза
				result.addClass('result_active'); //отображение результата		
				//зажечь 1 звезду. Сработает всегда - минимальная награда	
				setTimeout(() =>{
					$(result.children()[1]).addClass('result__star_active');
					sounds.beep.play();
				}, timer);
				if(prize > 1) //зажечь две звезды
					setTimeout(() => {
						$(result.children()[0]).addClass('result__star_active');
						sounds.beep.stop();
						sounds.beep.play();
					}, timer + 500);
				if(prize > 2) //зажечь три звезды
					setTimeout(() => {
						$(result.children()[2]).addClass('result__star_active');
						sounds.beep.stop();
						sounds.beep.play();
					}, timer + 1000);
				if(!isGameFinished){ //Условие для однократного исполнения блок инструкций
					isGameFinished = 1; 
					setTimeout(() => {
						// Скрыть звезды
						result.children().css({transform: 'scale(0)', transition: '0.4s'});
						//вызов функции создания шаров
						createBalloon(document.querySelector('.result'));
						//звук аплодисментов
						sounds.aplause.play();
						}, timer + 2500)
				}
				return;
			}

			let cur_animal = this.animals[index][2].toLowerCase();
			test_question.text(`Где ${cur_animal}?`) //Создать вопрос для теста
			//Пустой массив для дальнейшего заполнения
			animals_arr = [null, null, null, null];
			//Добавляем зверя с вопроса в массив.
			let cur_animal_pos = ~~(Math.random() * 4);
			animals_arr[cur_animal_pos] = index;
			//Заполняем массив до конца сулчайными зверями
			animals_arr.forEach((x, i, arr) => randomNumber(arr, i, animals_list.length - 1));
			//Заполнения текущего вопроса
			animals_arr.forEach(function (elem, ind) {
				//Определить в какой слот поместить зверя
				let container = $(test_body.children()[ind]);
				//Создать картинку зверя
				let animal_img = $('<img>', {src: `${this.animals[elem][0]}`, 
																		 class: 'test__img',
																		 alt: `${this.animals[elem][2]}`
																		 });
				//добавить зверя. Reset обновляет анимацию нового вопроса.
				container.html(animal_img).removeClass('reset');
				setTimeout(() => container.addClass('reset'), 20)
			}, this);

		}

		build_task(index); //вызов функции построения вопроса
		//transform-origin css property map
		let trans_origin_map = {
			0: '0 0',
			1: '100% 0',
			2: '0 100%',
			3: '100% 100%'
		};
		//обработка событий внутри теста.
		let start_next_question; 
		test_body.on('click', function (evt) {
			let target = $(evt.target);
			if(target.prop('tagName') !== 'IMG') return; //только для IMG
			let target_index = $(this).children().index(target.parent());

			//для верного ответа
			if(animals_arr[target_index] === index){
				//сформировать новый вопрос при повторном клике по верному ответу
				if(target.hasClass('test__img_active')){
					//отменить таймер след. вопроса
					clearTimeout(start_next_question);
					//остановить звук
					const current_sound = this_obj.animals[index][4];
					current_sound && current_sound.stop();
					//запустить след. вопрос.
					index += 1; 
					build_task(index);
					return;
				}
				//если есть звук, то воспроизвести и записать длительность в перемнную
				let sound_length = 3;
				if(animals_list[index].length === 5)
					sound_length = this_obj.sound(index);
				//добавить анимацию верного ответа
				target.addClass('test__img_active')
							.css({'transform-origin': trans_origin_map[target_index],
										'animation-duration': sound_length + 's'});
				//Проверка, что верный ответ получен с первой попытки.
				if($('.wrong').length === 0)
					answers[1]++;
				answers[0]++;
				//запустить таймер до следующего вопроса
				start_next_question =  setTimeout(() => {
					index += 1; 
					build_task(index);
				}, sound_length * 1000);
			}

			//для неверного ответа
			else{
				target.addClass('wrong');
				sounds.wrong.play();
			}
		});

		//обработчик взрыва шарика
		result.on('click', function (evt) {
			//получить список элементов под курсором
			const balloons = getElementsFromPoint(evt.clientX, evt.clientY);
			//найти верхний use(сам шарик)
			for(const tag of balloons){
				const $tag = $(tag);
				const parent = $tag.parent()
				if($tag.prop('tagName') === 'use'){
					//анимация взрыва
					parent.html('<image href="img/boom.svg" class="balloon__boom"/>')
								.css('filter', 'none');
					//убрать анимацию
					setTimeout(() => parent.html('').remove(), 200);
					//звук взрыва
					const boom = new Audio;
					boom.src = 'sound/boom.mp3';
					boom.play();
					break; //прервать цикл т.к. нужный шар найден.
				}
			}
			//условие завершения игры и очистки контейнера
			//таймаут т.к. лопнутый шар исчезает через 200мс (281стр);
			setTimeout(() => {
				//3 svg звезды скрыты, поэтому 4 в условии
				if(result.children().length < 4){ 
					//для неповторяемости анимации по клику
					if(!this_game_node.hasClass('active'))
						this_game_node.css('animation', 'none');
					setTimeout(() => {
						this_game_node.css('animation', 'hinge 2s').addClass('active');
					}, 20);
					//очистка по окончанию анимации
					setTimeout(() => {
						this_game_node.html('').removeClass('active');
					}, 2000);
				}
			}, 7000);
		});
	}
}

//запуск игры при нажатии на кнопку
$('.animals__sub-btn').on('click', function (evt) {
	$('.game').html('');
	const parent = this.parentNode.parentNode;
	const game_node = parent.querySelector('.game');
	isGameFinished = 0;
	slider_pos = 1;
	moveSlider(); //Показать первый слайд
	const current_class = $(this).attr('data-class');
	const animal_class = new Slider(animals_maps[current_class], game_node).makeSlider();

	$(this).parent().children().removeClass('active');

	$('.game__play, .game__start-test').on('click', function () {
		$('.slider').remove();
		animal_class.play()
	});

	//Плавная прокрутка к окну с игрой
	const link = $(this).attr("data-href");
	$("html, body").stop().animate({scrollTop: $(link).offset().top - 200 + "px"}, 300);
});

$("img").on("dragstart", function(event) { event.preventDefault(); });

//звук при нажатии на солнце
let sound_start = performance.now();
$('.main-menu__sun').on('click', function(){
	//Не повторять звук, пока не закончится предыдущий.
	let delay = performance.now()
	if(delay - sound_start < 1300) return;
	sound_start = performance.now();

	var laugh = new Audio();
	laugh.src = './sound/laugh.mp3';
	laugh.play();

	$('.sun').removeClass('sun_pulse');
	setTimeout(() => {$('.sun').addClass('sun_pulse');}, 20);
});