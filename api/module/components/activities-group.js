const db = require('../../../config/database');
const h = require('../../../helpers/helper');
const { templateResponse } = require('../../../config/constants');
const redis = require('../../../config/redis')

async function updateCache(data) {
    await redis.set('dataall', JSON.stringify(data))
}

async function getOneFullQuery(id) {
    return await db('activities-group').whereRaw(`id = ? and deleted_at is null`, [id])
}

exports.getAlldata = async () => {
    let data 
    if (await redis.get('dataall') !== null) {
        data = await redis.get('dataall')
        data = JSON.parse(data)
    } else {
        data = await db('activities-group').whereRaw(`deleted_at is null`)
        await updateCache(data)
    }
    return templateResponse('Success', false, 'Success', data)
}


exports.getOne = async (id) => {
    let data 
    if (await redis.get('dataall') !== null) {
        data = await redis.get('dataall')
        data = JSON.parse(data)
        data = data.filter(x => x.id == id)
        data = data[0]
    } else {
        data = await db('activities-group').whereRaw(`id = ? and deleted_at is null`, [id])
        data=data[0]
    }
    return templateResponse('Success', false, 'Success', data)
}


exports.deleteOne = async (id) => {
    let newDate = new Date()
    await db('activities-group').whereRaw(`id = ? and deleted_at is null`, [id]).update({
        deleted_at: newDate
    })
    let cek =  await redis.get('dataall')
    if (cek !== null) {
        cek = JSON.parse(cek)
        cek = cek.filter(x => x.id !== id)
        await updateCache(cek)
    }
    return templateResponse('Not Found', false, `Activity with ID ${id} Not Found`, {})
}

exports.postData = async (email, title) => {
    let data = await db('activities-group').insert({
        email,
        title,
        created_at: new Date()
    }).returning('id')
    let cek =  await redis.get('dataall')
    if (cek !== null) {
        let newData = await getOneFullQuery(data[0])
        cek = JSON.parse(cek)
        cek.push(newData)
        await updateCache(cek)
    } else {
        let newData = await getOneFullQuery(data[0])
        await updateCache([newData.data])
    }
    return templateResponse('Success', false, 'Success', data)
}

exports.patchData = async (id, email, title, ) => {
    let data = await db('activities-group').whereRaw(`id = ? and deleted_at is null`, [id]).update({
        email,
        title,
        updated_at: new Date()
    }).returning('id')
    let cek =  await redis.get('dataall')
    if (cek !== null) {
        cek = JSON.parse(cek)
        for (let index = 0; index < cek.length; index++) {
            const dataI = cek[index];
            console.log({dataI,id});
            if (dataI.id == id) {
                dataI.email = email
                dataI.title = title
            }
        }
        await updateCache(cek)
    }
    return templateResponse('Success', false, 'Success', data)
}