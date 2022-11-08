const db = require('../../../config/database');
const h = require('../../../helpers/helper');
const { templateResponse } = require('../../../config/constants');
const redis = require('../../../config/redis')

async function updateCache(data) {
    await redis.set('dataall', JSON.stringify(data))
}

async function getOneFullQuery(id) {
    return await db('todo-items').whereRaw(`id = ? and deleted_at is null`, [id])
}

exports.getAlldata = async (activity_group_id) => {
    let data 
    if (await redis.get('todosall') !== null) {
        data = await redis.get('todosall')
        data = JSON.parse(data)
        if (activity_group_id !== undefined) {
            data = data.filter(x => x.activity_group_id == activity_group_id)
        }
    } else {
        if (activity_group_id !== undefined) {
            data = await db('todo-items').whereRaw(`deleted_at is null and activity_group_id = ?`,[activity_group_id])
        } else {
            data = await db('todo-items').whereRaw(`deleted_at is null`)
            await updateCache(data)
        }
    }
    return templateResponse('Success', false, 'Success', data)
}


exports.getOne = async (id) => {
    let data 
    if (await redis.get('todosall') !== null) {
        data = await redis.get('todosall')
        data = JSON.parse(data)
        data = data.filter(x => x.id == id)
        data = data[0]
    } else {
        data = await db('todo-items').whereRaw(`id = ? and deleted_at is null`, [id])
        data = data[0]
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
        cek = cek.filter(x => x.id != id)
        await updateCache(cek)
    }
    return templateResponse('Not Found', false, `Activity with ID ${id} Not Found`, {})
}

exports.postData = async (activity_group_id, title, priority) => {
    let data = await db('todo-items').insert({
        activity_group_id,
        title,
        priority,
        created_at: new Date()
    }).returning('id')
    // data = await getOneFullQuery(data[0])
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

exports.patchData = async (id, activity_group_id, title, priority, is_active) => {
    let data = await db('todo-items').whereRaw(`id = ? and deleted_at is null`, [id]).update({
        activity_group_id,
        title,
        priority,
        is_active,
        updated_at: new Date()
    }).returning('id')
    // data = await getOneFullQuery(data[0])
    let cek =  await redis.get('dataall')
    if (cek !== null) {
        cek = JSON.parse(cek)
        for (let index = 0; index < cek.length; index++) {
            const dataI = cek[index];
            if (dataI.id == id) {
                dataI.activity_group_id = activity_group_id
                dataI.priority = priority
                dataI.title = title
                dataI.is_active = is_active
            }
        }
        await updateCache(cek)
    }
    return templateResponse('Success', false, 'Success', data)
}