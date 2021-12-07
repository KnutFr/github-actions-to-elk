
# Send Github Action logs to ELK  


# Use this action

You need to set some secrets before be able to run your pipeline:  

- GITHUB: Github PAT Token from https://github.com/settings/tokens
- ELASTIC_HOST: url of your elastic instance 
- ELASTIC_KEY_ID : generated from elastic API [see ELK Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html)
- ELASTIC_API_KEY : generated from elastic API [see ELK Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html)


Then add this to your workflow: 

```bash
  send-logs-to-elastic:
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Upload GitHub Action workflows logs to elastic
        uses: knutfr/github-actions-to-elk@v1.0.4
        with:
          githubToken: "${{ secrets.GITHUB }}"
          githubOrg: "myOrg"
          githubRepository: "myRepository"
          githubRunId: "${{ github.run_id }}"
          elasticHost: "${{ secrets.ELASTIC_HOST }}"
          elasticApiKeyId: "${{ secrets.ELASTIC_KEY_ID }}"
          elasticApiKey: "${{ secrets.ELASTIC_API_KEY }}"
          elasticIndex: "github"

```


# Contributing

## Code in Main

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies  
```bash
$ yarn install
```

Build the typescript and package it for distribution
```bash
$ yarn run build && yarn run package
```

Run the tests :heavy_check_mark:  
```bash
$ yarn test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

## Change action.yml

The action.yml defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
import * as core from '@actions/core';
...

async function run() {
  try { 
      ...
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
