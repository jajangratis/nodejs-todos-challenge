const db = require('../../../config/database');
const h = require('../../../helpers/helper');
const { templateResponse, systemError } = require('../../../config/constants');
const redis = require('../../../config/redis')

async function updateCache(data) {
    await redis.set('todosall', JSON.stringify(data))
}

async function getOneFullQuery(id) {
    return await db('todos').whereRaw(`id = ? and deleted_at is null`, [id])
}

exports.getAlldata = async (activity_group_id) => {
    try {
        let data 
        let dataRedis = await redis.get('todosall')
        if (dataRedis !== null) {
            data = await redis.get('todosall')
            data = JSON.parse(data)
            if (activity_group_id !== undefined) {
                data = data.filter(x => x.activity_group_id == activity_group_id)
            }
        } else {
            if (activity_group_id !== undefined) {
                data = await db('todos').whereRaw(`deleted_at is null and activity_group_id = ?`,[activity_group_id])
            } else {
                data = await db('todos').whereRaw(`deleted_at is null`)
                await updateCache(data)
            }
        }
        return templateResponse('Success', false, 'Success', data)
    } catch (error) {
        console.log({error});
        return templateResponse('System Error', false)
    }
}


exports.getOne = async (id) => {
    try {
        let data 
        let dataRedis = await redis.get('todosall')
        if ( dataRedis !== null) {
            dataRedis = JSON.parse(dataRedis)
            data = dataRedis.filter(x => x.id == id && x.deleted_at == null)
            data = data[0]
        } else {
            data = await db('todos').whereRaw(`id = ? and deleted_at is null`, [id])
            data = data[0]
        }
        if (h.checkNullQueryAll(data)) {
            return templateResponse('Not Found', false, `Todo with ID ${id} Not Found`)
        } else {
            return templateResponse('Success', false, 'Success', data)
        }
    } catch (error) {
        console.log({error});
        return templateResponse('System Error', false)
    }
}


exports.deleteOne = async (id) => {
    try {
        let newDate = new Date()
        let cekExisting = await getOneFullQuery(id)
        if (!h.checkNullQueryAll(cekExisting)) {
            await db('todos').whereRaw(`id = ? and deleted_at is null`, [id]).update({
                deleted_at: newDate
            })
            let cek =  await redis.get('dataall')
            cek = JSON.parse(cek)
            if (cek !== null) {
                cek = cek.filter(x => x.id != id)
                await updateCache(cek)
            }
            return templateResponse('Success', false, `Todo with ID ${id} Not Found`, {})
        } else {
            return templateResponse('Not Found', false, `Todo with ID ${id} Not Found`, {})
        }
    } catch (error) {
        console.log({error});
        return templateResponse('System Error', false)
    }
}

exports.postData = async (activity_group_id, title, priority) => {
    try {
        if (h.checkNullQueryAll(title)) {
            return templateResponse('Bad Request', false, 'title cannot be null')
        }
        if (h.checkNullQueryAll(activity_group_id) || activity_group_id == undefined) {
            return templateResponse('Bad Request', false, 'activity_group_id cannot be null')
        }
        let data = await db('todos').insert({
            activity_group_id,
            title,
            priority,
            is_active: true,
            created_at: new Date()
        }).returning('id')
        // data = await getOneFullQuery(data[0])
        let cek =  await redis.get('dataall')
        let newData = await getOneFullQuery(data[0])
        if (cek !== null) {
            cek = JSON.parse(cek)
            cek.push(newData[0])
            await updateCache(cek)
        } else {
            await updateCache([newData[0]])
        }
        if (newData[0].is_active == 1) {
            newData[0].is_active = true
        }
        if (newData[0].is_active == 0) {
            newData[0].is_active = false
        }
        return templateResponse('Success', false, 'Success', newData[0], undefined, 201)
    } catch (error) {
        console.log({error});
        return templateResponse('System Error', false)
    }
}

exports.patchData = async (id, activity_group_id, title, priority, is_active) => {
    try {
        if (h.checkNullQueryAll(id)) {
            return templateResponse('Bad Request', false, 'id cannot be null')
        }
        let existing = await getOneFullQuery(id)
        if (h.checkNullQueryAllExtended(existing)) {
            return templateResponse('Not Found', false, `Todo with ID ${id} Not Found`, {})
        }
        let data = await db('todos').whereRaw(`id = ? and deleted_at is null`, [id]).update({
            activity_group_id:h.checkNullQueryAll(activity_group_id) ? existing[0].activity_group_id: activity_group_id,
            title:h.checkNullQueryAll(title) ? existing[0].title: title,
            priority:h.checkNullQueryAll(priority) ? existing[0].priority: priority,
            is_active:h.checkNullQueryAll(is_active) ? existing[0].is_active: is_active,
            updated_at: new Date()
        }).returning('id')
        // data = await getOneFullQuery(data[0])
        let cek =  await redis.get('dataall')
        cek = JSON.parse(cek)
        if (cek !== null) {
            for (let index = 0; index < cek.length; index++) {
                const dataI = cek[index];
                if (dataI.id == id) {
                    dataI.activity_group_id = h.checkNullQueryAll(activity_group_id) ? existing[0].activity_group_id: activity_group_id
                    dataI.priority = h.checkNullQueryAll(priority) ? existing[0].priority: priority
                    dataI.title = h.checkNullQueryAll(title) ? existing[0].title: title
                    dataI.is_active =  h.checkNullQueryAll(is_active) ? existing[0].is_active: is_active
                }
            }
            await updateCache(cek)
        }
        let updated = await getOneFullQuery(id)
        return templateResponse('Success', false, 'Success', updated[0])
    } catch (error) {
        console.log({error});
        return templateResponse('System Error', false)
    }
}