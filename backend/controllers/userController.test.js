import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import bcrypt from 'bcryptjs'

import app from '../app'
import connectDB from '../config/database'
import User from '../models/user'

let mongoServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await connectDB(uri)
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
})

afterEach(async () => {
    await User.deleteMany({})
})

describe('POST /api/users/register', () => {
    it('1.1. Must be able to register a new user successfully', async () => {
        const res = await request(app).post('/api/users/register').send({
            username: 'user',
            password: 'password'
        })

        expect(res.status).toBe(201)
        expect(res.body.message).toBe('User registered successfully')
    })

    it('1.2. Must return 400 if "username" already exists', async () => {
        await User.create({ username: 'user', password: 'password' })

        const res = await request(app).post('/api/users/register').send({
            username: 'user',
            password: 'anotherPassword'
        })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Username already exists')
    })

    it('1.3. Must be able to return 500 on DB error during registration', async () => {
        // Simula erro no `User.findOne`
        const originalFindOne = User.findOne
        User.findOne = () => { throw new Error('DB error') }

        const res = await request(app).post('/api/users/register').send({
            username: 'user',
            password: 'password'
        })

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error registering user')

        User.findOne = originalFindOne
    })
})

describe('POST /api/users/login', () => {
    it('1.1. Must be able to login successfully with valid credentials', async () => {
        const password = await bcrypt.hash('password', 10)
        const user = await User.create({ username: 'user', password })

        const res = await request(app).post('/api/users/login').send({
            username: 'user',
            password: password
        })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('token')
        expect(res.body.userID).toBe(user._id.toString())
    })

    it('1.2. Must return 400 for non-existent user', async () => {
        const res = await request(app).post('/api/users/login').send({
            username: 'user',
            password: 'password'
        })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid username or password')
    })

    it('1.3. Must return 400 for incorrect password', async () => {
        const password = await bcrypt.hash('correctpass', 10)
        await User.create({ username: 'user', password })

        const res = await request(app).post('/api/users/login').send({
            username: 'user',
            password: 'something'
        })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid username or password')
    })

    it('1.4. Should return 500 on DB error during login', async () => {
        const originalFindOne = User.findOne
        User.findOne = () => { throw new Error('DB error') }

        const res = await request(app).post('/api/users/login').send({
            username: 'user',
            password: 'password'
        })

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error logging in')

        User.findOne = originalFindOne
    })
})
