const fs = require('fs');
const JsonFind = require('json-find');
const path = require('path');
const fetch = require('node-fetch');

usersPath = path.normalize(__dirname + '/../database/users.json');

function getMessageHTML(message, emotes) {
  if (!emotes) return message;

  const stringReplacements = [];

  Object.entries(emotes).forEach(([id, positions]) => {
    const position = positions[0];
    const [start, end] = position.split("-");
    const stringToReplace = message.substring(
      parseInt(start, 10),
      parseInt(end, 10) + 1
    );

    stringReplacements.push({
      stringToReplace: stringToReplace,
      replacement: `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${id}/3.0">`,
    });
  });

  const messageHTML = stringReplacements.reduce(
    (acc, { stringToReplace, replacement }) => {
      return acc.split(stringToReplace).join(replacement);
    },
    message
  );

  return messageHTML;
}

function readUser(id) {
  var data = fs.readFileSync(usersPath, (err, _data) => {
    if (err) return console.log(err);
    return _data;
  });
  json = JSON.parse(data);
  var doc = JsonFind(json);
  return [doc.checkKey(id), json];
}

function getImgUrl(id) {
  return fetch(`https://api.twitch.tv/kraken/users/${id}`, {
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': 'w91zmuhv5rv2k51l9jl1f26nhu7fgp'
    }
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

function createUser(tags, json) {
  return getImgUrl(tags['user-id']).then((res) => {
    if (res['logo']) {
      url = res['logo'].replace(/300/g, '70');
    }
    else {
      url = 'https://static-cdn.jtvnw.net/user-default-pictures-uv/13e5fa74-defa-11e9-809c-784f43822e80-profile_image-70x70.png'
    }
    json[tags['user-id']] = {
      "color": tags['color'],
      "display-name": tags['display-name'],
      "subscriber": tags['subscriber'],
      "logo": url,
    }
    new_json = JSON.stringify(json);
    fs.writeFileSync(usersPath, new_json, (err) => {
      if (err) return console.log(err);
    });
    var doc = JsonFind(json);
    return doc.checkKey(tags['user-id']);
  });
}

module.exports.readUser = readUser;
module.exports.createUser = createUser;
module.exports.getMessageHTML = getMessageHTML;