import { Mock, describe, expect, it, vi } from 'vitest'
import { CreateUserService } from './CreateUserService'
import { User } from '../entities/User'
import * as repositories from '../repositories'
import { UserRepository } from '../repositories'
import { getRepository } from 'typeorm'
// import { jest } from '@jest/globals';

// vi.mock('../repositories/index.ts', () => {
//   UserRepository: vi.fn() 
// })

// const UserRepository = UserRepository as vi.Mock

// vi.mock('typeorm', () => {
//   return { getRepository: vi.fn() }
// })

vi.mock("typeorm", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    getRepository: vi.fn()
    // your mocked methods
  }
})

interface IFactorySut {
  sut: CreateUserService
}

const factorySut = (): IFactorySut => {
  const sut = new CreateUserService();
  return {
    sut
  }
}

describe('Create user service test.', () => {

  it('should be able to create a new user', async () => {
    const payloadCreateUser = {
      password: 'gabriel',
      username: 'gabriel'
    }

    const mockUserRepository = {
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation((userData) => userData),
      save: vi.fn().mockResolvedValue({})
    };

    (getRepository as Mock).mockReturnValue(mockUserRepository);
    
    const { sut } = factorySut()
    const response = await sut.execute(payloadCreateUser);

    expect(response).toEqual(expect.objectContaining({
      username: payloadCreateUser.username,
      password: expect.any(String)
    }))

    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should not be able to create user already exists', async () => {
    const payloadCreateUser = {
      password: 'gabriel',
      username: 'gabriel'
    }

    const mockUserRepository = {
      findOne: vi.fn().mockResolvedValue(payloadCreateUser),
    };
    (getRepository as Mock).mockReturnValue(mockUserRepository);

    const { sut } = factorySut()
    const response = await sut.execute(payloadCreateUser);

    expect(response).toBeInstanceOf(Error)
  })
});