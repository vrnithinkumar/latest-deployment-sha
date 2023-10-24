# Github action to get the commit of latest active deployment

[![GitHub Super-Linter](https://github.com/vrnithinkumar/latest-deployment-sha/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/vrnithinkumar/latest-deployment-sha/actions/workflows/ci.yml/badge.svg)

Use this action to get the commit SHA of latest active deployment in a Github repository. 

**NOTE:** ⚠️ The github action job need to explicitly add [permission](https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs#defining-access-for-the-github_token-scopes) `deployments: read` to read the deployments. 


## Inputs
- `repo_owner`: **(required)** Owner of the reepository.
- `repo_name`: **(required)** Name of the reepository.
- `environment`: **(required)** Deployment environment.
- `branch`: **(optional)** To find the latest deployment in specified branch. Default branch is **main**.

## Outputs
- `sha`: Commit sha of latest **ACTIVE** deployment.

## Usage

```yaml
jobs:
  sample-job:
    name: Get the latest deployment sha
    runs-on: ubuntu-latest
    permissions:
      deployments: read
      contents: read
  steps:
    - name: Checkout
      id: checkout
      uses: actions/checkout@v3

    - name: Get sha of latest deployment in main branch
      id: latest-deployment-sha
      uses: vrnithinkumar/latest-deployment-sha@v0.0.1
      with:
        repo_owner: vrnithinkumar
        repo_name: latest-deployment-sha
        environment: production
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    - name: Print Output
      id: output
      run: echo "${{ steps.latest-deployment-sha.outputs.sha }}"
```
# License
The scripts and documentation in this project are released under the [MIT License](LICENSE)