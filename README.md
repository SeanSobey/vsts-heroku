# Overview

The Heroku Tools for Microsoft Visual Studio Team Services (VSTS) adds tasks to easily enable build and release pipelines in VSTS and Team Foundation Server to work with [Heroku](https://heroku.com), and run commands using the Heroku CLI.

The AWS Tools for VSTS is available from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=seansobey.vsts-heroku-cli).

## Highlighted Features

### VSTS Heroku CLI Install

![vsts heroku cli install](images/vsts-heroku-cli-install.png)

This will install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#other-installation-methods) on the build agent, addes it to the tools cache and addes to the PATH variable so the CLI can be accessed globally.

If no version is found in cache the latest version will be downloaded. Since the CLI is self-updating the cached verison is not version checked.

Since [build tool installers](https://docs.microsoft.com/en-us/vsts/pipelines/process/tasks?view=vsts#tool-installers) are not persisted on TFS [Hosted Agents](https://docs.microsoft.com/en-us/vsts/pipelines/agents/hosted?view=vsts) you can select `Disable cache` to skip the caching which can reduce the time spent in this task quite significantly depending on the host OS.

### VSTS Heroku CLI

![vsts heroku cli run](images/vsts-heroku-cli-run.png)

This is a convenience task to run [Heroku CLI commands](https://devcenter.heroku.com/articles/heroku-cli-commands) on a build agent. It assumes and requires that the `VSTS Heroku CLI Install` task has been run before on the same agent.

It handles [authentication](https://devcenter.heroku.com/articles/authentication) for commands using an API token via an environment variable passed to the command shell. Its reccomennded to pass this in using a [build variable](https://docs.microsoft.com/en-us/vsts/pipelines/build/variables?view=vsts&tabs=batch).

## Minimum supported environments

- Visual Studio Team Services
- Team Foundation Server 2015 Update 3 (or higher)
