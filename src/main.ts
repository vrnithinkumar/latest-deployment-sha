import * as core from '@actions/core'
import { Octokit } from '@octokit/action'

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

interface QueryResult {
  repository: {
    deployments: {
      nodes: Node[]
    }
  }
}

interface Node {
  createdAt: string
  environment: string
  updatedAt: string
  state: string
  ref: {
    name: string
  }
  commit: {
    oid: string
  }
}

// no of deployemts to fetch via graphql query
// TODO: configure by user input/or keep trying different sizes
const MAX_DEPLOYEMENTS_TO_FETCH = 10

export async function run(): Promise<void> {
  try {
    const time = Date.now()
    const owner: string = core.getInput('repo_owner').trim()
    const name: string = core.getInput('repo_name').trim()
    const env: string = core.getInput('environment').trim()
    const branch: string =
      core.getInput('branch').trim().length === 0
        ? 'main'
        : core.getInput('branch').trim()

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Finding sha for ${owner}/${name} for env ${env} ...`)

    const query = `
query ($repo_owner: String!, $repo_name: String!, $environment: String!) {
  repository(owner: $repo_owner, name: $repo_name) {
    deployments(environments: [$environment], first: ${MAX_DEPLOYEMENTS_TO_FETCH}, orderBy: { field: CREATED_AT, direction: DESC }) {
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
    core.info(` branch to filter is: ${branch}`)

    const octokit = new Octokit()

    const variables = {
      repo_owner: owner,
      repo_name: name,
      environment: env
    }
    const data = await octokit.graphql<QueryResult>(query, variables)
    core.info(JSON.stringify(data))

    const nodes: Node[] = data.repository.deployments.nodes
    for (const node of nodes) {
      core.info(`   Created At: ${node.createdAt}`)
      core.info(`   Environment: ${node.environment}`)
      core.info(`   Updated At: ${node.updatedAt}`)
      core.info(`   State: ${node.state}`)
      core.info(`   Ref Name: ${node.ref.name}`)
      core.info(`   Commit OID: ${node.commit.oid}`)
    }

    const activeDeployments = nodes.filter(
      (node: Node) => node.ref.name === branch && node.state === 'ACTIVE'
    )

    if (activeDeployments.length === 0) {
      core.setFailed(
        `Could not find any active deployements for '${owner}/${name}' for env '${env}' in the branch '${branch}'`
      )
    } else {
      core.setOutput('sha', activeDeployments[0].commit.oid)
    }
    core.info(`< 200 ${Date.now() - time}ms`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
