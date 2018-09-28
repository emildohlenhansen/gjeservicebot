// Description:
// Easter eggs

const moment = require('moment');

moment.locale('nb');

const dagsbilder = [
  [
    'https://media.giphy.com/media/Q7kfqzaYuAwSI/giphy.gif',
    'https://media.giphy.com/media/26BRynKeJEweP1r4Q/giphy.gif',
    'https://media.giphy.com/media/5epqQGCG4Nr6E/giphy.gif',
    'https://media.giphy.com/media/8ORG71gPI3GU/giphy.gif'
  ],
  [
    'https://media.giphy.com/media/l2JJLQSMaYe9eVEJ2/giphy.gif',
    'https://media.giphy.com/media/xiAqCzbB3eZvG/giphy.gif',
    'https://66.media.tumblr.com/75fcbedf5286c1f0725f13819f2637d4/tumblr_n40m34Vjt11ql198go1_500.gif',
    'https://storage.googleapis.com/imgfave/image_cache/14246922685277_animate.gif'
  ],
  [
    'https://media.giphy.com/media/3oGRFBdaLd2H6nK0oM/giphy.gif',
    'https://media.giphy.com/media/CsR56PJlHELUA/giphy.gif',
    'https://media.giphy.com/media/3o7qE1K2hRrqsRjane/giphy.gif',
    'https://media.giphy.com/media/rwL730SvRjTwc/giphy.gif'
  ],
  [
    'https://media.giphy.com/media/LAuZzXWT5n7K8/giphy.gif',
    'https://i.imgflip.com/k7u3b.jpg',
    'https://media2.giphy.com/media/pFwRzOLfuGHok/200.gif#0',
    'https://media.giphy.com/media/l2JJLQSMaYe9eVEJ2/giphy.gif'
  ],
  [
    'https://media.giphy.com/media/ogxOm2syETTj2/giphy.gif',
    'https://media.giphy.com/media/WoaluZhDpz3zy/giphy.gif',
    'http://i2.kym-cdn.com/photos/images/facebook/000/117/021/enhanced-buzz-28895-1301694293-0.jpg',
    'http://i1.kym-cdn.com/photos/images/original/000/117/009/soon.jpg'
  ],
  [
    'https://media.giphy.com/media/26vUsARImRG7qT6ww/giphy.gif',
    'https://media.giphy.com/media/26BRIL53texMuRZra/giphy.gif',
    'https://media.giphy.com/media/d2ZfzmOhBzYm92FO/giphy.gif',
    'https://media.giphy.com/media/l0HlS8qchQ80zf94I/giphy.gif',
    'http://media3.giphy.com/media/ZdFxoPhIS4glG/giphy.gif'
  ],
  [
    'https://media.giphy.com/media/oeLMCy3Fbl8Os/giphy.gif',
    'https://i.imgflip.com/oox2k.jpg',
    'http://img.memecdn.com/it-amp-039-s-saturday_o_2044879.jpg',
    'http://s2.quickmeme.com/img/54/548743857b51de6224c5632c25800a9d8b1a1cb22693431ef78d80aedcf9d1e8.jpg'
  ]
];

const noenPrefixes = [
  'Din tur i dag',
  'Gidder du',
  'Kom igjen'
];

module.exports = (robot) => {
  robot.respond(/er det fredag/i, (res) => {
    const day = new Date().getDay();
    res.send(`${day === 5 ? 'Ja!! :tada:' : 'Nope...'}\n${res.random(dagsbilder[day])}`);
  });

  robot.respond(/(hvor lenge (.*)til|er det lenge til|når er det) fredag/i, (res) => {
    const days = moment().isoWeekday(5).diff(moment({ hour: 0 }), 'days');
    if (days === 0) {
      res.send(`Det er fredag! :tada:\n${res.random(dagsbilder[5])}`);
    } else if (days === 1) {
      res.send(`Det er ${moment().isoWeekday(5).hour(0).fromNow(true)} til fredag!`);
    } else {
      res.send(`Det er ${days} dager til fredag`);
    }
  });

  robot.respond(/(.*)meningen med livet/i, (res) => {
    robot.emit('reactions.add', { emoji: 'thinking_face', message: res.message });
    setTimeout(() => res.reply('42!'), 3500);
  });

  robot.hear(/@noen/, (msg) => {
    const roomId = msg.message.room;
    const roomType = roomId.toLowerCase().charAt(0) !== 'u' &&
    roomId.toLowerCase().charAt(0) === 'c'
      ? 'channel'
      : 'group';
    if (!roomType) {
      msg.send(`Fant ikke romtype for rom ${msg.message.room} :pensive:`);
    } else {
      robot
        .http(`https://slack.com/api/${roomType}s.info?token=${process.env.HUBOT_SLACK_TOKEN}&channel=${roomId}`)
        .get()((err, res, body) => {
          if (err) {
            msg.send('Noe gikk galt :pensive:');
            robot.logger.info(`Respond @noen error: ${err}`);
          } else {
            const users = JSON.parse(body)[roomType].members;
            const chosen = msg.random(users);
            if (robot.brain.data.users[chosen]) {
              msg.send(`${msg.random(noenPrefixes)} @${robot.brain.data.users[chosen].name}`);
            } else {
              robot.http(`https://slack.com/api/users.list?token=${process.env.HUBOT_SLACK_TOKEN}`)
                .get()((error, response, data) => {
                  const username = JSON.parse(data).members
                    .filter(member => member && member.id)
                    .find(member => member.id === chosen)
                    .name;
                  msg.send(`${msg.random(noenPrefixes)} @${username}`);
                });
            }
          }
        });
    }
  });

  robot.catchAll((res) => {
    const robotName = new RegExp(`(?:@${robot.alias}|@${robot.name})`);
    if (!res.message.text || !res.message.text.match(robotName)) return;
    robot.logger.info(`catchAll: ${res.message.user.name} - ${res.message.text}`);
    res.send('Skjønner ikke hva du mener, prøv å spørre meg om hjelp :robot_face:');
  });
};
