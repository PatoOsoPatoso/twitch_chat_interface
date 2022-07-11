const ipcRenderer = require('electron').ipcRenderer;
const electron_main_window = require('electron-main-window');

var chat_container = document.getElementById('chat').firstElementChild;
var favs_container = document.getElementById('favorites').firstElementChild;
favs_container.style.display = 'none';

var classMsg = 'bi bi-chat-square-fill';
var classFav = 'bi bi-bookmark-star-fill';

var exitBtn = document.getElementById('svg_exit');
var add_read = document.getElementById('add_read');

var chat_count = 0;
var favs_count = 0;

exitBtn.addEventListener('click', () => {
  electron_main_window.getMainWindow().close();
});

function mouseOverHandler() {
  electron_main_window.getMainWindow().setIgnoreMouseEvents(false);
}

function mouseOutHandler() {
  electron_main_window.getMainWindow().setIgnoreMouseEvents(true, { forward: true });
}

function swap_chat() {
  document.getElementById('svg_msg').style.fill = 'gold';
  document.getElementById('svg_fav').style.fill = 'purple';
  chat_container.style.display = 'block';
  favs_container.style.display = 'none';
}

function swap_favs() {
  document.getElementById('svg_msg').style.fill = 'purple';
  document.getElementById('svg_fav').style.fill = 'gold';
  chat_container.style.display = 'none';
  favs_container.style.display = 'block';
}

ipcRenderer.on('new_message', function (event, msg) {
  chat_count++;
  document.getElementById('count_msg').innerHTML = chat_count;

  var _div = document.createElement('div');
  var _img = document.createElement('img');
  var _span = document.createElement('span');
  var _svg1 = document.createElement('svg');
  var _svg2 = document.createElement('svg');
  var _h2 = document.createElement('h2');
  var _p = document.createElement('p');

  _div.className = 'new_message';
  _img.className = 'rounded-circle';
  _img.src = msg['logo'];
  _img.alt = 'logo';
  _span.className = 'h3';
  _span.innerHTML = msg['display-name'];
  _span.style.color = msg['color'];
  _svg1.innerHTML = '<svg id="add_fav" width="25" height="25" class="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path></svg>'
  _svg2.innerHTML = '<svg id="add_read" width="25" height="25" class="bi bi-check-square-fill" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"></path></svg>'
  _h2.innerHTML = msg['message'];
  _p.innerHTML = msg['description'];
  _div.appendChild(_img);
  _div.appendChild(_span);
  _div.appendChild(_svg1);
  _div.appendChild(_svg2);
  _div.appendChild(_h2);
  _div.appendChild(_p);
  chat_container.insertBefore(_div, chat_container.firstChild);
  _svg2.addEventListener('click', () => {
    _div.remove();
    chat_count--;
    document.getElementById('count_msg').innerHTML = chat_count;
  });
  _svg1.addEventListener('click', () => {
    var _div2 = _div.cloneNode(true);
    _div.remove();
    _div2.getElementsByTagName('svg')[0].remove();
    favs_container.insertBefore(_div2, favs_container.firstChild);
    _div2.getElementsByTagName('svg')[0].addEventListener('click', () => {
      _div2.remove();
      favs_count--;
      document.getElementById('count_fav').innerHTML = favs_count;
    });
    chat_count--;
    favs_count++;
    document.getElementById('count_msg').innerHTML = chat_count;
    document.getElementById('count_fav').innerHTML = favs_count;
  })
});