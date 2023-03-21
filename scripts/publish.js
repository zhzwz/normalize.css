import { argv } from 'process'
import { promisify } from 'util'
import { exec } from 'child_process'
import chalk from 'chalk'

const [, , version] = argv
const command = promisify(exec)

if (/^[\d]{1,}\.[\d]{1,}\.[\d]{1,}$/.test(version)) {
  console.log(chalk.cyan(`Version: ${version}`))
  commit()
} else {
  console.error(chalk.red(`Invalid version: ${version}`))
}

async function commit() {
  const { stderr, stdout } = await command(`pnpm version ${version} -m "publish: version ${version}"`)
  if (stderr) console.error(chalk.red(stderr))
  if (stdout) {
    console.log(stdout)
    publish()
  }
}

async function publish() {
  const { stderr, stdout } = await command('pnpm publish --access public')
  if (stderr) console.error(chalk.red(stderr))
  if (stdout) console.log(chalk.green(stdout))
}