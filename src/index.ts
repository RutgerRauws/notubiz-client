import dotenv from 'dotenv'
import { writeFile } from 'fs/promises'
import * as Winston from 'winston'

dotenv.config()

async function main() {
  const logger = Winston.createLogger({
    level: 'info',
    format: Winston.format.combine(
      Winston.format.timestamp(),
      Winston.format.printf(
        ({ timestamp, level, message }) =>
          `${timestamp} [${level.toUpperCase()}] ${message}`
      )
    ),
    transports: [new Winston.transports.Console()],
  })

  logger.info('Hello world!')
}

main()
