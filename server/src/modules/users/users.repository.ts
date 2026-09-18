/**
 * Users repository.
 *
 * Backed by an in-memory Map: a working store with no dependencies.
 *
 * The factory's return type IS the contract: `UsersRepository` is derived
 * from it, so the implementation and its interface cannot drift apart. To swap
 * stores, write another factory returning a compatible shape and bind that one
 * in the module — nothing else has to change.
 */
import { randomUUID } from 'node:crypto'
import { createToken, HttpException } from '@forinda/kickjs'
import type { ParsedQuery } from '@forinda/kickjs'
import type { UsersResponseDTO } from './dtos/users-response.dto'
import type { CreateUsersDTO } from './dtos/create-users.dto'
import type { UpdateUsersDTO } from './dtos/update-users.dto'

export function createUsersRepository() {
  const store = new Map<string, UsersResponseDTO>()

  return {
    async findById(id: string): Promise<UsersResponseDTO | null> {
      return store.get(id) ?? null
    },

    async findAll(): Promise<UsersResponseDTO[]> {
      return [...store.values()]
    },

    async findPaginated(parsed: ParsedQuery): Promise<{ data: UsersResponseDTO[]; total: number }> {
      const all = [...store.values()]
      const { offset, limit } = parsed.pagination
      return { data: all.slice(offset, offset + limit), total: all.length }
    },

    async create(dto: CreateUsersDTO): Promise<UsersResponseDTO> {
      const now = new Date().toISOString()
      const entity = {
        id: randomUUID(),
        ...dto,
        createdAt: now,
        updatedAt: now,
      } as UsersResponseDTO
      store.set(entity.id, entity)
      return entity
    },

    async update(id: string, dto: UpdateUsersDTO): Promise<UsersResponseDTO> {
      const existing = store.get(id)
      if (!existing) throw HttpException.notFound('Users not found')
      const updated = { ...existing, ...dto, updatedAt: new Date().toISOString() }
      store.set(id, updated)
      return updated
    },

    async delete(id: string): Promise<void> {
      if (!store.has(id)) throw HttpException.notFound('Users not found')
      store.delete(id)
    },
  }
}

/** The contract, derived from the factory rather than declared beside it. */
export type UsersRepository = ReturnType<typeof createUsersRepository>

/**
 * Collision-safe DI token bound to `UsersRepository`.
 * `container.resolve(USERS_REPOSITORY)` and
 * `@Inject(USERS_REPOSITORY)` both return the typed
 * contract — no manual generic, no `any` cast.
 *
 * The `'kick-fullstack-server/'` prefix matches the project scope so
 * `kick-lint`'s `token-reserved-prefix` rule never fires —
 * adopters must NOT use the reserved `'kick/'` namespace.
 */
export const USERS_REPOSITORY = createToken<UsersRepository>(
  'kick-fullstack-server/Users/repository',
)
