# PagerDuty OnCall Slack Action

Github Action that handles the following:

1. Calls the PagerDuty API to get the on-call person on schedule.
2. Notifies a Slack channel with the on-call person.

## Inputs

### `pagerduty-api-token`

(Required) PagerDuty API user token.

### `slack-webhook-url`

(Required) URL of the Slack webhook to send the message to.

### `slack-channel`

(Required) Slack channel to send the message to.

## Example Usage

```yaml
name: PagerDuty OnCall Notify

on:
  schedule:
    - '0 0 * * 1-5'

jobs:
  pagerduty_oncall_notify:
    runs-on: ubuntu-latest
    name: PagerDuty OnCall Notify
    steps:
      - name: Notify
        uses: loopsocial/pagerduty-oncall-slack-action@v1.0.0
        with:
          pagerduty-api-token: ${{ secrets.PAGERDUTY_API_TOKEN }}
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          slack-channel: "my-channel"
```
