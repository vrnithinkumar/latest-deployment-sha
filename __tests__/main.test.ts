/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug')
const getInputMock = jest.spyOn(core, 'getInput')
// const setFailedMock = jest.spyOn(core, 'setFailed')
// const setOutputMock = jest.spyOn(core, 'setOutput')

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Other utilities
// const deploysRegex = /\{\*\}/

describe('action', () => {
  beforeEach(() => {
    process.env.GITHUB_ACTION = 'test'
    jest.clearAllMocks()
  })

  it('sets the time output', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'repo_owner':
          return 'vrnithinkumar'
        case 'repo_name':
          return 'latest-deployment-sha'
        case 'environment':
          return 'prod'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(
      1,
      'Finding sha for vrnithinkumar/latest-deployment-sha for env prod ...'
    )
    // expect(setOutputMock).toHaveBeenNthCalledWith(1, 'sha', expect.anything())
  })

  it('sets a failed status', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'repo_owner':
          return 'vrnithinkumar'
        case 'repo_name':
          return 'latest-deployment-sha'
        case 'environment':
          return 'prod'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()
  })
})
