# Create a JavaScript Action Using TypeScript

[![GitHub Super-Linter](https://github.com/vrnithinkumar/latest-deployment-sha/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/vrnithinkumar/latest-deployment-sha/actions/workflows/ci.yml/badge.svg)

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

    - name: Get sha of latest deployment
      id: latest-deployment-sha
      uses: vrnithinkumar/latest-deployment-sha@v1
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
