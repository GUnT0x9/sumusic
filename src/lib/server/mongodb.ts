import { MongoClient, type Db } from 'mongodb'

declare global {
  // eslint-disable-next-line no-var
  var sumusicMongoClientPromise: Promise<MongoClient> | undefined
}

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not configured')
  }
  return uri
}

export async function getMongoDb(): Promise<Db> {
  const dbName = process.env.MONGODB_DB ?? 'sumusic'

  if (!global.sumusicMongoClientPromise) {
    const client = new MongoClient(getMongoUri(), {
      serverSelectionTimeoutMS: 10000,
    })
    global.sumusicMongoClientPromise = client.connect()
  }

  const client = await global.sumusicMongoClientPromise
  return client.db(dbName)
}
