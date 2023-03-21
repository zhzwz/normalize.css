import { argv } from 'process'
import { promisify } from 'util'
import { exec } from 'child_process'
import chalk from 'chalk'

const [, , version] = argv
const command = promisify(exec)

if (/^[\d]{1,}\.[\d]{1,}\.[\d]{1,}$/.test(version)) {
  commit()
} else {
  console.error(chalk.red(`Invalid version: ${version}`))
}

async function commit() {
  const { stdout, stderr } = await command(`pnpm version ${version} -m "release: version ${version}"`)
  if (stdout) {
    console.log(chalk.green(stdout))
    release()
  }
  if (stderr) console.error(chalk.red(stderr))
}

async function release() {
  const { stdout, stderr } = await command('pnpm publish --access public')
  if (stdout) console.log(chalk.green(stdout))
  if (stderr) console.error(chalk.red(stderr))
}