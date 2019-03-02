$('.log').text(window.innerWidth)

class MoveSVG{
  constructor(node){
    this.x = +node.getAttribute('cx');
    this.y = +node.getAttribute('cy');
    this.node = node;
    this.initital_params = [this.x, this.y];
  }
  setNewParams(new_params){
    this.x = new_params[0];
    this.y = new_params[1];
    this.node.setAttribute('cx', new_params[0]);
    this.node.setAttribute('cy', new_params[1]);
    return this;
  }

  returnInitital(){
    this.setNewParams(this.initital_params);
  }
}

const lk_1 = $('.LK-data__1');
const lk_2 = $('.LK-data__2');
const distance = $('.distance');
const incline = $('.incline');
const accuracy_el = $('.accuracy');
const interp = $('.interp');
const interp_container = $('.function__interp');
const circle = new MoveSVG(document.querySelector('.LK-2'));
const depth = $('#depth');

$('input, select').on('input', function (evt) {
  $('.log').html('')
  let ready = 1;
  const accuracy = accuracy_el.val();

  if($('#interp').val() < 0.5) return; //не считать, е сли шаг итерп. меньше 0.5

  $('input').each(function () {
    if(!$(this).val()) ready = 0;
  });
  
  if(ready){
    const lk_1_val = +lk_1.val() + depth.val() / 100;
    const lk_2_val = +lk_2.val() + depth.val() / 100;
    interp_container.html(''); //удаление интерполированных точек SVG
    const excess = lk_1_val - lk_2_val; //разница высот между колодцами
    const xScale = 675 / distance.val(); //масштаб

    let direction = 0; //направление смещения колодца
    //второй колодец ниже или выше?
    if(excess > 0) direction = -1;
    if(excess < 0) direction = 1;

    circle.setNewParams([825,255 - 55 * direction]); //меняем положение колодца в свг
    let cur_incline = Math.abs(excess / distance.val()) * 1000; //текущий уклон

    let dist1 = (+distance.val() + Math.abs(excess) / (incline.val() / 1000)) / 2;
    //если полученная длинна участка до водор. больше длины м/у колодцами, значит сущ. уклон больше искомого.
    if(dist1 >= distance.val()){
      dist1 = distance.val();
      $('.log').html(
        `Существующий уклон между колодцами больше искомого: <b>${Math.round(cur_incline * 10) / 10}‰ </b> <br>
        <b>Устройство водораздела не требуется</b>`);
    }

    let dist2 = distance.val() - dist1;
    if(direction < 0) [dist1, dist2] = [dist2, dist1];

    //если существующий уклон больше искомого, то используем его
    let useIncline = incline.val() > cur_incline ? incline.val() : cur_incline;
    let watershed = dist1 * useIncline / 1000 + +lk_1_val; //отметка водораздела
    let watershedYpos = 205 - 20 * direction; //Высота водор. на СВГ
    const watershed_xPos = xScale * dist1; // положение водораздела в свг
    //добавить текст с отметкой для водораздела, если есть.
    if(dist1 !=0 && dist2 !=0){
      const watershed_text = createSVG('text', 150 + watershed_xPos, watershedYpos, watershed);
      interp_container[0].appendChild(watershed_text);
    }

    //---------------------интерполяция------------------------
    $('.result-interp').html(''); //очистка таблиц с интерполяцией
    let interp_data =  ''; // таблица интерполяции
    [dist1, dist2].forEach(function(sector, ind){ 
      if(sector <= +interp.val()) return; //выходим, если интерполировать нечего
      const count = Math.ceil(sector / interp.val()); //число уч.
      const dist = sector / count; //длина уч.

      //заголовок таблицы
      interp_data += `<tr><th colspan=3>LK-${ind + 1}</th></tr>`;
      //тело таблицы
      for (let i = 1; i < count; i++) {
        let interp_mark = ind === 0 ? +lk_1_val + dist * i * useIncline / 1000 : +lk_2_val + dist * i * useIncline / 1000;
        interp_data += 
        `<tr>
          <td>${i}</td>
          <td>${Math.round(dist * i * 100)  / 100}</td>
          <td>${Math.round(interp_mark * accuracy) / accuracy}</td>
        </tr>`;

        //данные для второго уч.
        if(dist1 == 0) watershedYpos = 255;
        let interpYPos = 255 - 55 * direction - (255 - 55 * direction - watershedYpos) / count * i;
        let interpXPos = 825 - dist * i * xScale;

        if(ind === 0){ //данные для первого уч.
          if(dist1 === distance.val()) watershedYpos = 200;
          interpYPos = 255 - (255 - watershedYpos) / count * i;
          interpXPos = 150 + dist * i * xScale;
        }
        //интерп. точка на графике
        const circle_interp = createSVG('circle');
        circle_interp.setAttribute('cx', interpXPos);
        circle_interp.setAttribute('cy', interpYPos );
        //интерп. отметка на графике
        const text_mark = createSVG('text', interpXPos, interpYPos, interp_mark);

        interp_container[0].appendChild(circle_interp);
        interp_container[0].appendChild(text_mark);
      }
    });

    interp_data = '<table>' + interp_data + '</table>';
    $('.result-interp')[0].innerHTML += interp_data;
    //---------------------конец интерполяциии------------------------

    //---------------------Отрисовка таблицы--------------------------
    $('.result').html(
      `<table>
        <tr><td>Сущ. уклон между колодцами:</td><td>${Math.round(cur_incline * 10) / 10}‰</td></tr>
        <tr><td>От 1 колодца до водораздела:</td><td>${Math.round(dist1 * 100) / 100}м.</td></tr> 
        <tr><td>От 2 колодца до водораздела:</td><td>${Math.round(dist2 * 100) / 100}м.</td></tr>
        <tr><td>Отметка водораздела:</td><td>${Math.round(watershed * accuracy) / accuracy}м.</td></tr>
      </table>`)
    ;
    //---------------------конец отрисовки таблицы--------------------------

    //---------------------перемещение водораздела--------------------------
    const lk_1_text_mark = createSVG('text', 150, 255, lk_1_val);
    const lk_2_text_mark = createSVG('text', 825, circle.y, lk_2_val);
    interp_container[0].appendChild(lk_1_text_mark);
    interp_container[0].appendChild(lk_2_text_mark);

    setTimeout(() => {
      $('.svg-graph__function').attr('points', `150,255 ${150 + watershed_xPos},${watershedYpos} 825,${circle.y}`);
      $('.watershed').attr({'cx': 150 + watershed_xPos, 'cy': watershedYpos})
    }, 20);
    //---------------------конец перемещения водораздела--------------------------  
  }
});

$('.voda-form__info').on('click', function (evt) {
  evt.preventDefault();
  $('.voda-form__info i').toggleClass('active');
});

$('body').on('click', function (evt) {
  if(evt.target.tagName !== 'SPAN')
    $('.voda-form__info i').removeClass('active');
});

$('.svg-container__fold').on('click', function (evt) {
  this.classList.toggle('svg-container__fold_active');
  this.parentNode.classList.toggle('svg-container_folded');
});

$(document).tooltip();

function createSVG(tag = 'circle', x, y, z){
  const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if(tag === 'circle'){
    elem.setAttribute('r', '11');
    elem.classList.add('circle_interp')
  }
  if(tag === 'text'){
    const accuracy = accuracy_el.val();
    elem.textContent = (Math.round(z * accuracy) / accuracy).toFixed(accuracy.length - 1);
    elem.classList.add('function__text-mark');
    elem.setAttribute('x', x - 20);
    elem.setAttribute('y', y - 30);
  }
  return elem;
}
