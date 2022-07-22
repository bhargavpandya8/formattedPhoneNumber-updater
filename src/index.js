const { MongoClient } = require('mongodb')

// TODO: replace with actual creds
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
const dbName = 'o4s-local'
const collectionName = 'userSupplyticsProdLocal'

;(async function IIFE() {
  try {
    await client.connect()
    const db = client.db(dbName)
    const collection = db.collection(collectionName)
    const data = await collection
      .find({
        companyCode: 'akzonobel-india',
        type: 'DISTRIBUTOR',
      })
      .toArray()

    const documentsWithPhoneNumber = data.filter(
      (document) => document.phoneNumber != null
    )

    for (const document of documentsWithPhoneNumber) {
      document.formattedPhoneNumber = {
        phoneNumber: document.phoneNumber,
        countryCode: '+91',
      }

      await collection.updateOne({ _id: document._id }, { $set: document })
    }

    console.log('data', documentsWithPhoneNumber)
  } catch (err) {
    console.log(err)
  }
})()
