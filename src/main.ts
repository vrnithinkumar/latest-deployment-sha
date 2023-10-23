import * as core from '@actions/core'
import { wait } from './wait'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const repo_owner: string = core.getInput('repo_owner')
    const repo_name: string = core.getInput('repo_name')
    const env: string = core.getInput('environment')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Finding sha for ${repo_owner}/${repo_name} for env ${env} ...`)

    // Set outputs for other workflow steps to use
    core.setOutput('sha', '${repo_owner}/${repo_name}:${env}')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
