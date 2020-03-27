const program = require('commander')
const path =require('path')

console.log(process.argv)

const {
  version
} = require('./constance')

const mapActions = {
  create: {
    alias: 'c',
    description: 'create a project',
    examples: [
      'toimooc-cli create <project-name>'
    ]
  },
  config: {
    alias: 'c',
    description: 'config project variable',
    examples: [
      'toimooc-cli config set <k> <v>',
      'toimooc-cli config get <k>',
    ]
  },
  '*': {
    alias: 'c',
    description: 'command not found',
    examples: []
  }
}

Reflect.ownKeys(mapActions).forEach(action => {
  program
    .command(action)
    .alias(mapActions[action].alias)
    .description(mapActions[action].description)
    .action(() => {
      // console.log('done')
      if (action === '*') {
        console.log(mapActions[action].description)
      } else {
        require(path.resolve(__dirname, action))(...process.argv.slice(3))
      }
    })
})


program.on('--help', () => {
  Reflect.ownKeys(mapActions).forEach(action => {
    mapActions[action].examples.forEach(example => {
      console.log('    ' + example)
    })
  })
})


program.version(version).parse(process.argv)