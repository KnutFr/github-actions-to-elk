import * as core from '@actions/core'
import {
  ElasticMessageFormat,
  createAxiosGithubInstance,
  createElasticInstance,
  sendMessagesToElastic,
  sendRequestToGithub
} from './requests'
import {loadInput} from './tool'

async function run(): Promise<void> {
  try {
    const githubToken: string = loadInput('githubToken')
    const githubOrg: string = loadInput('githubOrg')
    const githubRepository: string = loadInput('githubRepository')
    const githubRunId: string = loadInput('githubRunId')
    const elasticApiKeyId: string = loadInput('elasticApiKeyId')
    const elasticApiKey: string = loadInput('elasticApiKey')
    const elasticHost: string = loadInput('elasticHost')
    const elasticIndex: string = loadInput('elasticIndex')
    const elasticCloudId: string = loadInput('elasticCloudId')
    const elasticCloudUser: string = loadInput('elasticCloudUser')
    const elasticCloudPassword: string = loadInput('elasticCloudPassword')

    core.info(`Initializing Github Connection Instance`)
    const githubInstance = createAxiosGithubInstance(githubToken)
    core.info(`Initializing Elastic Instance`)
    const elasticInstance = createElasticInstance(
      elasticHost,
      elasticApiKeyId,
      elasticApiKey,
      elasticCloudId,
      elasticCloudUser,
      elasticCloudPassword
    )

    const metadataUrl = `/repos/${githubOrg}/${githubRepository}/actions/runs/${githubRunId}`
    core.info(`Retrieving metadata from Github Pipeline ${githubRunId}`)
    const metadata = await sendRequestToGithub(githubInstance, metadataUrl)
    const jobsUrl = metadata.jobs_url
    core.info(`Retrieving jobs list  from Github Pipeline ${githubRunId}`)
    const jobs = await sendRequestToGithub(githubInstance, jobsUrl)
    for (const job of jobs.jobs) {
      core.info(`Parsing Job '${job.name}'`)
      const achievedJob: ElasticMessageFormat = {
        id: job.id,
        name: job.name,
        metadata,
        status: job.status,
        conclusion: job.conclusion,
        steps: job.steps,
        details: job,
        logs: await sendRequestToGithub(
          githubInstance,
          `/repos/${githubOrg}/${githubRepository}/actions/jobs/${job.id}/logs`
        )
      }
      await sendMessagesToElastic(elasticInstance, achievedJob, elasticIndex)
    }
  } catch (e) {
    if (e instanceof Error) {
      core.setFailed(e.message)
    }
  }
}

run()
