const db = require('../../../config/database');
const h = require('../../../helpers/helper');
const { templateResponse } = require('../../../config/constants');
const redis = require('../../../config/redis')

async function updateCache(data) {
    await redis.set('dataall', JSON.stringify(data))
}


exports.getAlldata = async () => {
    let data 
    if (await redis.get('todosall') !== null) {
        data = await redis.get('todosall')
        data = JSON.parse(data)
    } else {
        data = await db('todo-items').whereRaw(`deleted_at is null`)
        await updateCache(data)
    }
    return templateResponse('Success', false, 'Success', data)
}


exports.getOne = async (id) => {
    let data 
    if (await redis.get('todosall') !== null) {
        data = await redis.get('todosall')
        data = JSON.parse(data)
        data = data.filter(x => x.id == id)
    } else {
        data = await db('todo-items').whereRaw(`id = ? and deleted_at is null`, [id])
    }
    return templateResponse('Success', false, 'Success', data)
}


exports.deleteOne = async (id) => {
    let newDate = new Date()
    await db('todo-items').whereRaw(`id = ? and deleted_at is null`, [id]).update({
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

exports.postData = async (activity_group_id, title, priority) => {
    let data = await db('todo-items').insert({
        activity_group_id,
        title,
        priority,
    }).returning('id')
    // data = await this.getOne(data[0])
    let cek =  await redis.get('dataall')
    if (cek !== null) {
        cek = JSON.parse(cek)
        cek.push(data)
        await updateCache(cek)
    }
    return templateResponse('Success', false, 'Success', data)
}

exports.patchData = async (id, activity_group_id, title, priority) => {
    let data = await db('todo-items').whereRaw(`id = ? and deleted_at is null`, [id]).update({
        activity_group_id,
        title,
        priority,
        updated_at: new Date()
    }).returning('id')
    // data = await this.getOne(data[0])
    let cek =  await redis.get('dataall')
    if (cek !== null) {
        cek = JSON.parse(cek)
        for (let index = 0; index < cek.length; index++) {
            const dataI = cek[index];
            if (dataI == id) {
                dataI.activity_group_id = activity_group_id
                dataI.priority = priority
                dataI.title = title
            }
        }
        await updateCache(cek)
    }
    return templateResponse('Success', false, 'Success', data)
}