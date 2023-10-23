import * as core from '@actions/core'
import Octokit from '@octokit/action'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */

/* To run this graphql to get 
gh api graphql -F repo_owner='PPROGroup' -F repo_name='pl-b-girolink'  -F environment='prod' -f query='
query ($repo_owner: String!, $repo_name: String!, $environment: String!) {
  repository(owner: $repo_owner, name: $repo_name) {
    deployments(environments: [$environment], first: 10, orderBy: { field: CREATED_AT, direction: DESC }) {
      nodes {
        createdAt
        environment
        updatedAt
		    state
        ref {
          name
        }
		    commit {  
			    oid  
		    }
      }
    }
  }
}
'
*/
export async function run(): Promise<void> {
  try {
    const owner: string = core.getInput('repo_owner')
    const name: string = core.getInput('repo_name')
    const env: string = core.getInput('environment')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Finding sha for ${owner}/${name} for env ${env} ...`)

    const query = `
      query ($repo_owner: String!, $repo_name: String!, $environment: String!) {
        repository(owner: $repo_owner, name: $repo_name) {
          deployments(environments: [$environment], first: 10, orderBy: { field: CREATED_AT, direction: DESC }) {
            nodes {
              createdAt
              environment
              updatedAt
              state
              ref {
                name
              }
              commit {  
                oid  
              }
            }
          } 
        }
      }`

    core.info(query)

    const time = Date.now()
    const octokit = new Octokit()

    const variables = {
      repo_owner: owner,
      repo_name: name,
      environment: env
    }
    const data = await octokit.graphql(query, variables)

    core.info(`< 200 ${Date.now() - time}ms`)
    // const deployments = JSON.parse(data);
    core.setOutput('sha', data)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
