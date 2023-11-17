# Release Cop Notify Action

Github Action that handles the following:

1. Calls the OpsGenie API to get the on-call person.
2. Posts a Slack message to nominate the Release Cop.

## Inputs

### `opsgenie-api-key`

(Required) OpsGenie API key.

### `opsgenie-schedule-id`

(Required) OpsGenie Schedule ID to get the on-call person from.

### `slack-webhook-url`

(Required) URL of the Slack webhook to send the message to.

## Example Usage

```yaml
name: Release Cop Notify

on:
  schedule:
    - '0 0 * * 1-5'

jobs:
  release_cop_notify:
    runs-on: ubuntu-latest
    name: Release Cop Notify
    steps:
      - name: Notify
        uses: loopsocial/release-cop-notify-action@v1.0.0
        with:
          opsgenie-api-key: ${{ secrets.OPSGENIE_API_KEY }}
          opsgenie-schedule-id: ${{ secrets.OPSGENIE_SCHEDULE_ID }}
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
```
