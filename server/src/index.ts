import { bootstrap } from '@forinda/kickjs'
import { applicationOptions } from './options'

// Export the app for the Vite plugin (dev mode)
export const app = await bootstrap(applicationOptions)
