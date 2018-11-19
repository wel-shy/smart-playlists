import { Express } from 'express'
import home from './home'

export const addRoutes = (app: Express) => {
  app.use('/', home())
  return app
}
