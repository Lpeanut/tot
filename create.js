const axios = require('axios')
const ora = require('ora')
const Inquirer = require('inquirer')

// 封装loading效果
const waitFnloading = (fn, message) => async(...args) => {
  const spinner = ora(message)
  spinner.start()
  const result = await fn(...args)
  spinner.succeed()
  return result;
}

const fetchTagList = async () => {
  const { data } = await axios.get('https://api.github.com/repos/Lpeanut/Fina/branch');
  return data;
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
  const { tag } = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'please choise a tag',
    choices: tags
  })
  tags = tags.map(item => item.name)
  console.log('tags', tags)
}