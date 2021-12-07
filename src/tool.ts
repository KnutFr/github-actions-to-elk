import * as core from '@actions/core'

export function loadInput(inputName: string): string {
  try {
    return core.getInput(inputName)
  } catch (e) {
    throw new Error(`Cannot retrieve parameters ${inputName}`)
  }
}

export interface Job {
  id: number
  name: string
  status: string
  conclusion: string
  steps: string
  logs: string
}
