if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    '\u001b[33mThis project requires using pnpm as the package manager.\u001b[39m\n'
  )
  process.exit(1)
}
