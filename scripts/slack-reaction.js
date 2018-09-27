// Description:
//  Make the bot react!

const token = process.env.HUBOT_SLACK_TOKEN;
const url = 'https://slack.com/api/reactions.add';

module.exports = (robot) => {
  const react = ({ emoji, message }) => {
    robot.http(`${url}?token=${token}&name=${emoji}&channel=${message.room}&timestamp=${message.id}`)
      .get()((err, res, body) => {
        robot.logger.info('slack-reaction error: ', res.statusCode, body);
      });
  };
  robot.on('reactions.add', data => react(data));
};
