import * as core from '@actions/core'
import Axios, {AxiosInstance} from 'axios'
import {Client} from '@elastic/elasticsearch'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function sendRequestToGithub(client: AxiosInstance, path: string) {
  try {
    const response = await client.get(path)
    core.debug(response.data)
    return response.data
  } catch (e) {
    throw new Error(`Cannot send request to Github : ${e}`)
  }
}

export async function sendMessagesToElastic(
  client: Client,
  messages: {
    conclusion: string
    name: string
    id: number
    steps: string
    logs: {}
    status: string
  }[],
  elasticIndex: string
): Promise<void> {
  try {
    core.debug(`Push to elasticIndex`)
    client.bulk({body: messages, index: elasticIndex})
  } catch (e) {
    throw new Error(`Cannot send request to Elastic : ${e}`)
  }
}

export function createAxiosGithubInstance(token: string): AxiosInstance {
  return Axios.create({
    baseURL: 'https://api.github.com',
    timeout: 1000,
    headers: {Authorization: `token ${token}`}
  })
}

export function createElasticInstance(
  elasticUrl: string,
  elasticApiKeyId: string,
  elasticApiKey: string
): Client {
  return new Client({
    node: elasticUrl,
    auth: {
      apiKey: {
        id: elasticApiKeyId,
        api_key: elasticApiKey
      }
    }
  })
}
