import { MongoMemoryServer } from 'mongodb-memory-server'
import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach } from 'vitest'
import mongoose from 'mongoose'
import request from 'supertest'
import Save from '../models/save'
import app from '../app'
import connectDB from '../config/database'

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
    await Save.deleteMany({})
})

describe('POST /api/memory/save', () => {
    it('1.1. "saveGameData()" should be able to save game data successfully with valid parameters', async () => {
        const res = await request(app)
            .post('/api/memory/save')
            .send({
                userID: '67ebe3c794cc531ee35404f4',
                gameDate: '2025-04-10T12:00:00Z',
                failed: 2,
                difficulty: 'Easy',
                completed: 5,
                timeTaken: 120
            })

        expect(res.status).toBe(201)
        expect(res.body.message).toBe('Game data saved successfully')
    })

    it('1.2. "saveGameData()" should be return 400 if "userID" is invalid', async () => {
        const res = await request(app)
            .post('/api/memory/save')
            .send({
                userID: null,
                gameDate: '2025-04-10T12:00:00Z',
                failed: 2,
                difficulty: 'Easy',
                completed: 5,
                timeTaken: 120
            })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Missing required fields')
    })

    it('1.3. "saveGameData()" should be return 400 if "gameDate" is invalid', async () => {
        const res = await request(app)
            .post('/api/memory/save')
            .send({
                userID: '67ebe3c794cc531ee35404f4',
                gameDate: null,
                failed: 2,
                difficulty: 'Easy',
                completed: 5,
                timeTaken: 120
            })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Missing required fields')
    })

    it('1.4. "saveGameData()" should be return 400 if "failed" is invalid', async () => {
        const res = await request(app)
            .post('/api/memory/save')
            .send({
                userID: '67ebe3c794cc531ee35404f4',
                gameDate: '2025-04-10T12:00:00Z',
                failed: undefined,
                difficulty: 'Easy',
                completed: 5,
                timeTaken: 120
            })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Missing required fields')
    })

    it('1.5. "saveGameData()" should be return 400 if "difficulty" is invalid', async () => {
        const res = await request(app)
            .post('/api/memory/save')
            .send({
                userID: '67ebe3c794cc531ee35404f4',
                gameDate: '2025-04-10T12:00:00Z',
                failed: 2,
                difficulty: undefined,
                completed: 5,
                timeTaken: 120
            })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Missing required fields')
    })

    it('1.6. "saveGameData()" should be return 400 if "completed" is invalid', async () => {
        const res = await request(app)
            .post('/api/memory/save')
            .send({
                userID: '67ebe3c794cc531ee35404f4',
                gameDate: '2025-04-10T12:00:00Z',
                failed: 2,
                difficulty: 'Easy',
                completed: undefined,
                timeTaken: 120
            })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Missing required fields')
    })

    it('1.7. "saveGameData()" should be return 400 if "timeTaken" is invalid', async () => {
        const res = await request(app)
            .post('/api/memory/save')
            .send({
                userID: '67ebe3c794cc531ee35404f4',
                gameDate: '2025-04-10T12:00:00Z',
                failed: 2,
                difficulty: 'Easy',
                completed: 5,
                timeTaken: undefined
            })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Missing required fields')
    })

    it('1.8. Should be able to return 500 if "userId" is invalid', async () => {
        const res = await request(app)
            .post('/api/memory/save')
            .send({
                userID: 'invalid',
                gameDate: '2025-04-10T12:00:00Z',
                failed: 2,
                difficulty: 'Easy',
                completed: 5,
                timeTaken: 120
            })

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error saving game data')
    })

    it('1.9. Should be able to return 500 if "difficulty" isnt an enum', async () => {
        const res = await request(app)
            .post('/api/memory/save')
            .send({
                userID: 'invalid',
                gameDate: '2025-04-10T12:00:00Z',
                failed: 2,
                difficulty: 'meh',
                completed: 5,
                timeTaken: 120
            })

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error saving game data')
    })
})

describe('GET /api/memory/score/:difficulty/:uid', () => {
    beforeEach(async () => {
        await Save.create([
            {
                userID: '67ebe3c794cc531ee35404f4',
                gameDate: '2025-04-10T12:00:00Z',
                failed: 1,
                difficulty: 'Hard',
                completed: 3,
                timeTaken: 110
            },
            {
                userID: '67ebe3c794cc531ee35404f4',
                gameDate: '2025-04-11T14:00:00Z',
                failed: 0,
                difficulty: 'Normal',
                completed: 4,
                timeTaken: 90
            },
            {
                userID: '67ebe3c794cc531ee35404f4',
                gameDate: '2025-04-11T14:00:00Z',
                failed: 0,
                difficulty: 'Easy',
                completed: 0,
                timeTaken: 200
            }
        ])
    })

    it('1.1. Should be able to retrieve the score history successfully with valid parameters', async () => {
        const res = await request(app)
            .get('/api/memory/scoreHistory/67ebe3c794cc531ee35404f4/Normal')

        expect(res.status).toBe(201)
        expect(res.body.length).toBe(1)
        expect(res.body[0]).toHaveProperty('gameDate')
        expect(res.body[0]).not.toHaveProperty('_id')
    })

    it('1.2. Should be able to retrieve an empty list it "uid" doesnt exist', async () => {
        const res = await request(app)
            .get('/api/memory/scoreHistory/67ebe3c794cc531ee35404f0/Normal')

        expect(res.status).toBe(201)
        expect(res.body.length).toBe(0)
    })

    it('1.3. Should be able to return 400 if "uid" has invalid parameter', async () => {
        const res = await request(app)
            .get('/api/memory/scoreHistory/ /Normal')

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid field type')
    })

    it('1.4. Should be able to return 404 if "difficulty" is empty', async () => {
        const res = await request(app)
            .get('/api/memory/scoreHistory/67ebe3c794cc531ee35404f0/')

        expect(res.status).toBe(404)
    })

    it('1.5. Should be able to return 404 if "uid" is empty', async () => {
        const res = await request(app)
            .get('/api/memory/scoreHistory//Normal')

        expect(res.status).toBe(404)
    })

    it('1.6. Should be able to return 500 if "uid" is invalid', async () => {
        const res = await request(app)
            .get('/api/memory/scoreHistory/invalid/Normal')

        expect(res.status).toBe(500)
        expect(res.body.message).toBe('Error getting game data')
    })
})
