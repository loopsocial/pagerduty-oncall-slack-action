const core = require('@actions/core')
const axios = require('axios')
const { api } = require('@pagerduty/pdjs')

/**
 * Gets the input from the used action.
 * @param {string} key Input key to fetch
 * @returns {string} Returns the value of the input.
 */
const getInput = (key) => {
  const input = core.getInput(key)
  if (!input) throw Error(`Input "${key}" was not defined`)
  return input
}

/**
 * Get the PagerDuty on-call name via the API.
 * @returns {string} Returns the PagerDuty on-call name.
 */
 const getPagerDutyOnCallName = async () => {
  const apiToken = core.getInput('pagerduty-api-token')
  const scheduleId = core.getInput('pagerduty-schedule-id')
  
  const pd = api({ token: apiToken })
  const { data: { oncalls } } = await pd.get(`/oncalls?schedule_ids%5B%5D=${scheduleId}`)
  if (oncalls.length === 0) throw Error('Schedule ID has no on-calls.')
  return oncalls[0].user.summary
}

/**
 * Constructs the Slack message JSON payload.
 * @param {string} onCallName PagerDuty on-call name.
 * @returns {string} Returns the Slack message JSON.
 */
const constructSlackMessage = (onCallName) => {
  return {
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": `${onCallName}, you are now on active duty as the Release Cop 🚔`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "@here Please fulfill your duty in making sure the current Release Candidate is in motion and unblocked."
        }
      }
    ]
  }
}

/**
 * Posts to Slack via webhook.
 * @param {object} body Body to post to Slack.
 */
 const postToSlack = async (body) => {
  const webhookUrl = getInput('slack-webhook-url')
  await axios.post(webhookUrl, body)
}

const run = async () => {
  try {
    // Get the current on-call name
    const onCallName = await getPagerDutyOnCallName()

    // Construct Slack message
    const message = constructSlackMessage(onCallName)

    // Post to Slack
    await postToSlack(message)
  } catch (error) {
    core.setFailed(error.message)
  }
}
run()
