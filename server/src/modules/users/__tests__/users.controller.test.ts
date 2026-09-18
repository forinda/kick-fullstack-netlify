import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { Container } from '@forinda/kickjs'
import { createTestApp } from '@forinda/kickjs-testing'

import { UsersModule } from '../users.module'

/**
 * Where this module is mounted.
 *
 * `createTestApp` builds its own Application with the framework defaults —
 * apiPrefix `/api` and defaultVersion `1` — whatever your `bootstrap()` uses,
 * so this is correct as generated. If your app configures them differently,
 * pass the same values in `boot()` below and update this to match, so the test
 * exercises the paths production actually serves:
 *
 *   defaultVersion: false  →  '/api/users'
 *   apiPrefix: '/v1'       →  '/v1/v1/users'
 */
const BASE = '/api/v1/users'

describe('UsersController', () => {
  beforeEach(() => {
    Container.reset()
  })

  /**
   * Boot the module through the real pipeline.
   *
   * Drive `app.handle` rather than an Express app: it is the Application's own
   * Node listener, so this test runs on whichever runtime the app is
   * configured with.
   */
  async function boot() {
    const { app, container } = await createTestApp({
      modules: [UsersModule()],
      // Mirror your bootstrap() here if it overrides either, and update BASE:
      // apiPrefix: '/api',
      // defaultVersion: 1,
    })
    return { app, container, agent: request(app.handle.bind(app)) }
  }

  describe('GET /users', () => {
    it('returns an empty page before anything is created', async () => {
      const { agent } = await boot()
      const res = await agent.get(BASE)

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ data: [], meta: { page: 1 } })
    })

    it.todo('returns created users, paginated')
  })

  // The cases below are scaffolding, not coverage. Each is `it.todo` so the
  // reporter lists it as outstanding instead of counting it as a pass. Replace
  // the todo with a real test as you implement each endpoint.

  describe('POST /users', () => {
    // Post a valid body, assert 201 and the created users in the response.
    it.todo('creates a users')
    // Post an invalid body, assert 422 and the validation detail.
    it.todo('rejects an invalid body')
  })

  describe('GET /users/:id', () => {
    // Create one, fetch it by id, assert the payload matches.
    it.todo('returns a users by id')
    // Fetch an id that does not exist, assert 404.
    it.todo('returns 404 for an unknown id')
  })

  describe('PUT /users/:id', () => {
    // Create, update, assert the change is reflected on a subsequent read.
    it.todo('updates an existing users')
  })

  describe('DELETE /users/:id', () => {
    // Create, delete, assert a subsequent read is 404.
    it.todo('deletes a users')
  })
})
