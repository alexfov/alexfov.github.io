class MoveSVG{
  constructor(node){
    this.x = +node.getAttribute('cx');
    this.y = +node.getAttribute('cy');
    this.node = node;
    this.initital_params = [this.x, this.y];
  }
  setNewParams(new_params, anim_time){
    const obj = this;
    const cur_params = [this.x, this.y];
    const diff = cur_params.map((cur_elem, i) => new_params[i] - cur_elem);
    this.diff = diff;
    let start = performance.now();
    let timing_fn = function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t };

    requestAnimationFrame(function animate () {
      let time_fraction = (performance.now() - start) / anim_time;
      if(time_fraction > 1) time_fraction = 1;
      let progress = timing_fn(time_fraction);

      obj.x = cur_params[0] + diff[0] * progress;
      obj.y = cur_params[1] + diff[1] * progress;

      obj.node.setAttribute('cx', obj.x);
      obj.node.setAttribute('cy', obj.y);

      if(time_fraction === 1) return;
      requestAnimationFrame(animate);
    });
  }

  returnInitital(time){
    this.setNewParams(this.initital_params, time);
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

$('#interp').on('input', function (evt) {
  if(this.value < 0.5) this.value = 0.5;
});

$('input, select').on('input', function (evt) {
  $('.log').html('')
  let ready = 1;
  const accuracy = accuracy_el.val();

  $('input').each(function () {
    if(!$(this).val()) ready = 0;
  });
  
  if(ready){
    interp_container.html(''); //удаление интерполированных точек SVG
    const excess = lk_1.val() - lk_2.val(); //разница высот между колодцами
    const xScale = 675 / distance.val(); //масштаб

    let direction = 0; //направление смещения колодца
    //второй колодец ниже или выше?
    if(excess > 0) direction = -1;
    if(excess < 0) direction = 1;

    circle.setNewParams([825,255 - 55 * direction], 0); //меняем положение колодца в свг
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
    let watershed = dist1 * useIncline / 1000 + +lk_1.val(); //отметка водораздела
    let watershedYpos = 205 - 20 * direction; //Высота водор. на СВГ
    const watershed_xPos = xScale * dist1; // положение водораздела в свг
    // $('.watershed title').text((Math.round(watershed * accuracy) / accuracy).toFixed(accuracy.length - 1));
    $('.watershed').attr('title', (Math.round(watershed * accuracy) / accuracy).toFixed(accuracy.length - 1));
    $('.LK-1').attr('title', (Math.round(lk_1.val() * accuracy) / accuracy).toFixed(accuracy.length - 1));
    $('.LK-2').attr('title', (Math.round(lk_2.val() * accuracy) / accuracy).toFixed(accuracy.length - 1));

    //---------------------интерполяция------------------------
    $('.result-interp').html(''); //очистка таблиц с интерполяцией
    let interp_data =  ''; // таблица интерполяции
    [dist1, dist2].forEach(function(x, ind){ 
      if(x <= +interp.val()) return; //выходим, если интерполировать нечего
      const count = Math.ceil(x / interp.val()); //число уч.
      const dist = x / count; //длина уч.

      //заголовок таблицы
      interp_data += `<tr><th colspan=3>LK-${ind + 1}</th></tr>`;
      for (let i = 1; i < count; i++) {
        let interp_mark = ind === 0 ? +lk_1.val() + dist * i * useIncline / 1000 : +lk_2.val() + dist * i * useIncline / 1000;
        interp_data += 
        `<tr>
          <td>${i}</td>
          <td>${Math.round(dist * i * 100)  / 100}</td>
          <td>${Math.round(interp_mark * accuracy) / accuracy}</td>
        </tr>`;

        const circle_interp = createSVG();
        circle_interp.setAttribute('title', (Math.round(interp_mark * accuracy) / accuracy).toFixed(accuracy.length - 1));
        if(ind === 0){
          if(dist1 === distance.val()) watershedYpos = 200;
          let interpYPos = 255 - (255 - watershedYpos) / count * i;
          circle_interp.setAttribute('cx', 150 + dist * i * xScale);
          circle_interp.setAttribute('cy', interpYPos );
        }
        else{
          if(dist1 == 0) watershedYpos = 255;
          let interpYPos = 255 - 55 * direction - (255 - 55 * direction - watershedYpos) / count * i;
          circle_interp.setAttribute('cx', 825 - dist * i * xScale);
          circle_interp.setAttribute('cy', interpYPos );
        }
        interp_container[0].appendChild(circle_interp);
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
    setTimeout(() => {
      $('.svg-graph__function').attr('points', `150,255 ${150 + watershed_xPos},${watershedYpos} ${circle.x},${circle.y}`);
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

function createSVG(tag = 'circle'){
  const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if(tag === 'circle'){
    elem.setAttribute('r', '10');
    elem.classList.add('circle_interp')
  }
  return elem;
}

$('.svg-container__fold').on('click', function (evt) {
  this.classList.toggle('svg-container__fold_active');
  this.parentNode.classList.toggle('svg-container_folded');
});

$(document).tooltip();