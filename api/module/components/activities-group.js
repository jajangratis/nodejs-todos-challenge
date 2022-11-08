const db = require('../../../config/database');
const h = require('../../../helpers/helper');
const { templateResponse } = require('../../../config/constants');
const redis = require('../../../config/redis')

async function updateCache(data) {
    await redis.set('dataall', JSON.stringify(data))
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
    } else {
        data = await db('activities-group').whereRaw(`id = ? and deleted_at is null`, [id])
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
        for (let index = 0; index < cek.length; index++) {
            const dataI = cek[index];
            if (dataI == id) {
                deleted_at = newDate
            }
        }
        await updateCache(cek)
    }
    return templateResponse('Not Found', false, `Activity with ID ${id} Not Found`, {})
}

exports.postData = async (email, title) => {
    let data = await db('activities-group').insert({
        email,
        title
    }).returning('id')
    let cek =  await redis.get('dataall')
    if (cek !== null) {
        cek = JSON.parse(cek)
        cek.push(data)
        await updateCache(cek)
    }
    return templateResponse('Success', false, 'Success', data)
}

exports.patchData = async (id, email, title) => {
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
            if (dataI == id) {
                dataI.email = email
                dataI.title = title
            }
        }
        await updateCache(cek)
    }
    return templateResponse('Success', false, 'Success', data)
}