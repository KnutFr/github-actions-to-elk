import * as core from '@actions/core'
import {Job, loadInput} from './tool'
import {
  createAxiosGithubInstance,
  createElasticInstance,
  sendMessageToElastic,
  sendRequestToGithub
} from './requests'


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

    const githubInstance = createAxiosGithubInstance(githubToken)
    const elasticInstance = createElasticInstance(
      elasticHost,
      elasticApiKeyId,
      elasticApiKey
    )

    const metadataUrl = `/repos/${githubOrg}/${githubRepository}/actions/runs/${githubRunId}`
    const metadata = JSON.parse(
      await sendRequestToGithub(githubInstance, metadataUrl)
    )
    const jobsUrl = metadata.jobs_url
    const achievedJobs: Job[] = []
    const jobs = JSON.parse(await sendRequestToGithub(githubInstance, jobsUrl))
    if (!jobs.ok) {
      core.setFailed('Failed to get run jobs')
    }
    for (const job of jobs.content.jobs) {
      if (job.status === 'completed') {
        achievedJobs[job.id] = {
          id: job.id,
          name: job.name,
          status: job.status,
          conclusion: job.conclusion,
          steps: job.steps,
          logs: await sendRequestToGithub(
            githubInstance,
            `/repos/${githubOrg}/${githubRepository}/actions/jobs/${job.id}/logs`
          )
        }
      }
      await sendMessageToElastic(
        elasticInstance,
        JSON.stringify(achievedJobs[job.id]),
        elasticIndex
      )
    }
  } catch (e) {
    if (e instanceof Error) {
      core.setFailed(e.message)
    }
  }
}

run()
