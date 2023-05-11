const { app, BrowserWindow, screen, systemPreferences } = require('electron');
const path = require('path');
const tmi = require('tmi.js');
const electron_main_window = require('electron-main-window');
const utils = require('./utils/utils')
const fetch = require('node-fetch');
const countries = require('country-flag-icons').countries;
const JsonFind = require('json-find');
const fs = require('fs');
require('dotenv').config()

const client = new tmi.Client({
  connection: { reconnect: true },
  channels: ['patoosopatoso'] // Change this username
});

client.connect();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
//   app.quit();
// }

const createWindow = () => {
  var main_display = screen.getPrimaryDisplay();

  var display_width = main_display.workAreaSize.width;
  var display_height = main_display.workAreaSize.height;
  var width = 500;
  var height = display_height;
  var x = display_width - width;
  var y = 0;

  // var displays = screen.getAllDisplays();
  // var externalDisplay = displays.find((display) => {
  //   return display.bounds.x !== 0 || display.bounds.y !== 0;
  // });

  // if (externalDisplay) {
  //   x = externalDisplay.bounds.x + externalDisplay.workAreaSize.width - width;
  // }

  const mainWindow = new BrowserWindow({
    x: x - 20,
    y: y,
    width: width,
    height: height,
    transparent: true,
    frame: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.setIgnoreMouseEvents(true, { forward: true });
  mainWindow.loadFile(path.join(__dirname, 'views/index.html'));
};

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

client.on('message', (channel, tags, message, self) => {
  if (/<[a-z][\s\S]*>/i.test(message)) return;
  const usersPath = path.normalize(__dirname + '/database/users.json');
  const badgesPath = path.normalize(__dirname + '/database/badges.json');
  var { badges } = tags;
  var users_json = require(usersPath);
  var doc = JsonFind(users_json);

  if (!doc.checkKey(tags['user-id'])) {
    users_json[tags['user-id']] = {
      'flag': '',
      'description': '',
    }
    fs.writeFile(usersPath, JSON.stringify(users_json), (err) => {
      if (err) console.log(err);
    }); // SE USA VARIAS VECES, MEJOR HACER FUNCIÓN
  }

  if (message[0] == '!') {
    const command = message.slice(1).split(' ')[0].toLowerCase();
    switch (command) {
      case 'bandera':
      case 'flag':
        var country = message.split(' ')[1];
        if (country && countries.includes(country.toUpperCase())) {
          users_json[tags['user-id']]['flag'] = `<img class="flag" src="https://raw.githubusercontent.com/WorldLanguagesArchive/countryflags.io-flags/master/flags/flags-iso/flat/64/${country.toUpperCase()}.png"></img>`;
          fs.writeFile(usersPath, JSON.stringify(users_json), (err) => {
            if (err) console.log(err);
          }); // SE USA VARIAS VECES, MEJOR HACER FUNCIÓN
        }
        break;
      case 'descripcion':
      case 'description':
        var description = message.split(' ').slice(1).join(' ');
        if (description.length <= 20) {
          users_json[tags['user-id']]['description'] = description;
          fs.writeFile(usersPath, JSON.stringify(users_json), (err) => {
            if (err) console.log(err);
          }); // SE USA VARIAS VECES, MEJOR HACER FUNCIÓN
        }
    }
  }
  else {
      var logo_url = 'https://static-cdn.jtvnw.net/user-default-pictures-uv/13e5fa74-defa-11e9-809c-784f43822e80-profile_image-70x70.png';
      const params = {
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'grant_type': 'client_credentials'
    };
    
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify( params )  
        };
      fetch('https://id.twitch.tv/oauth2/token', options)
        .then((url_response1) => url_response1.json())
          .then((url_json1) => {
    fetch(`https://api.twitch.tv/helix/users?id=${tags['user-id']}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + url_json1['access_token'],
            'Client-Id': process.env.CLIENT_ID
        }
})
      .then((url_response) => url_response.json())
      .then((url_json) => {
        if (url_json['data'][0]["profile_image_url"]) logo_url = url_json['data'][0]["profile_image_url"];

        var badges_json = require(badgesPath);
        var badges_list = []
        if (badges) {
          Object.entries(badges).forEach(([key, value]) => {
            var badge_url = badges_json[key]['versions'][value]['image_url_4x'];
            badges_list.push(`<img class="badges" src="${badge_url}"></img>`);
          });
        }
        var final_badges = badges_list.join('');
        var messageHTML = utils.getMessageHTML(message, tags['emotes']);
        var color = '#7E008D';
        if (tags['color']) color = tags['color'];
        var user = {
          "color": color,
          "display-name": `${final_badges} ${tags['display-name']} ${users_json[tags['user-id']]['flag']}`,
          "logo": logo_url,
          "message": messageHTML,
          "description": users_json[tags['user-id']]['description']
        };
        var window = electron_main_window.getMainWindow();
        window.send('new_message', user);
      })});
  }
});