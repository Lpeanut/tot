const path = require('path');
const axios = require('axios')
const ora = require('ora')
const Inquirer = require('inquirer')
const { promisify } = require('util');
let downloadGitRepo = require('download-git-repo')
downloadGitRepo = promisify(downloadGitRepo)
let ncp = require('ncp');
ncp = promisify(ncp);


const { downloadDirectory } = require('./constance');

const download = async (repo, tag) => {
  let api = `Lpeanut/${repo}`
  if (tag) {
    api += `#${tag}`
  }
  console.log(repo, tag)
  const dest = `${downloadDirectory}/${repo}`
  console.log(dest)
  await downloadGitRepo(api, dest)
  return dest
}

// 封装loading效果
const waitFnloading = (fn, message) => async(...args) => {
  const spinner = ora(message)
  spinner.start()
  try {
    let result = await fn(...args)
    spinner.succeed()
    return result;
  } catch (error) {
    console.log('error')
    spinner.succeed()
    process.exit(1)
    return []
  }
}

const fetchTagList = async () => {
  try {
    const { data } = await axios.get('https://api.github.com/repos/Lpeanut/tot/tags');
    return data;
  } catch (error) {
    return []
  }
}

const fetchRepoList = async () => {
  const { data } = await axios.get('https://api.github.com/users/Lpeanut/repos')
  return data
}


module.exports = async (projectName) => {
  let repos = await waitFnloading(fetchRepoList, 'fetching template')()
  repos = repos.map(item => item.name)
  const { repo } = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'please choise a template to create project',
    choices: repos
  })
  let tags = await waitFnloading(fetchTagList, 'fetching tags')(repo)
  tags = tags.map(item => item.name)
  const { tag } = await Inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: 'please choise a tag',
    choices: tags
  })
  const result = await waitFnloading(download, 'download') (repo, tag)
  console.log(result)
  ncp(result, path.resolve(projectName))
}