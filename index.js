const core = require("@actions/core");
const axios = require("axios");

// Constants
const OPSGENIE_API_BASE_URL = "https://api.opsgenie.com/v2";

/**
 * Gets the input from the used action.
 * @param {string} key Input key to fetch
 * @returns {string} Returns the value of the input.
 */
const getInput = (key) => {
  const input = core.getInput(key);
  if (!input) throw Error(`Input "${key}" was not defined`);
  return input;
};

/**
 * Get the OpsGenie on-call name via the API.
 * @returns {string} Returns the OpsGenie Schedule on-call name.
 */
const getOpsGenieOnCallName = async () => {
  const apiToken = core.getInput("opsgenie-api-token");
  const scheduleId = core.getInput("opsgenie-schedule-id");

  // Gets the on-call name from OpsGenie API
  const url = `${OPSGENIE_API_BASE_URL}/schedules/${scheduleId}/on-calls`;
  const {
    data: { onCallParticipants: onCalls },
  } = await axios.get(url, {
    headers: {
      Authorization: `GenieKey ${apiToken}`,
    },
  });

  // Handle API response
  if (!onCalls || !onCalls.length) throw Error("No On-Call found for Schedule");
  return onCalls[0].name;
};

/**
 * Constructs the Slack message JSON payload.
 * @param {string} onCallName PagerDuty on-call name.
 * @returns {string} Returns the Slack message JSON.
 */
const constructSlackMessage = (onCallName) => {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${onCallName}, you are now on active duty as the Release Cop 🚔`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "@here Please fulfill your duty in making sure the current Release Candidate is in motion and unblocked.",
        },
      },
    ],
  };
};

/**
 * Posts to Slack via webhook.
 * @param {object} body Body to post to Slack.
 */
const postToSlack = async (body) => {
  const webhookUrl = getInput("slack-webhook-url");
  await axios.post(webhookUrl, body);
};

const run = async () => {
  try {
    // Get the current on-call name
    const onCallName = await getOpsGenieOnCallName();

    // Construct Slack message
    const message = constructSlackMessage(onCallName);

    // Post to Slack
    await postToSlack(message);
  } catch (error) {
    core.setFailed(error.message);
  }
};
run();
