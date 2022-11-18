const db = require('../../../config/database');
const h = require('../../../helpers/helper');
const { templateResponse, systemError } = require('../../../config/constants');
const redis = require('../../../config/redis')

async function updateCache(data) {
    await redis.set('dataall', JSON.stringify(data))
}

async function getOneFullQuery(id) {
    return await db('activities').whereRaw(`id = ? and deleted_at is null`, [id])
}

exports.getAlldata = async () => {
    try {
        let data 
        if (await redis.get('dataall') !== null) {
            data = await redis.get('dataall')
            data = JSON.parse(data)
        } else {
            data = await db('activities').whereRaw(`deleted_at is null`)
            await updateCache(data)
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
        let dataRedis = await redis.get('dataall')
        if (dataRedis !== null) {
            dataRedis = JSON.parse(dataRedis)
            data = dataRedis.filter(x => x.id == id)
            data = data[0]
        } else {
            data = await db('activities').whereRaw(`id = ? and deleted_at is null`, [id])
            data=data[0]
        }
        if (h.checkNullQueryAll(data) || data == undefined) {
            return templateResponse('Not Found', false, `Activity with ID ${id} Not Found`)
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
            await db('activities').whereRaw(`id = ? and deleted_at is null`, [id]).update({
                deleted_at: newDate
            })
            let cek =  await redis.get('dataall')
            cek = JSON.parse(cek)
            if (cek !== null) {
                cek = cek.filter(x => x.id !== id)
                await updateCache(cek)
            }
            return templateResponse('Success', false, `Activity with ID ${id} Not Found`, {})
        } else {
            return templateResponse('Not Found', false, `Activity with ID ${id} Not Found`, {})
        }
    } catch (error) {
        console.log({error});
        return templateResponse('System Error', false)
    }

}

exports.postData = async (email, title) => {
    try {
        if (h.checkNullQueryAll(title)) {
            return templateResponse('Bad Request', false, 'title cannot be null')
        }
        if (h.checkNullQueryAll(email)) {
            return templateResponse('Bad Request', false, 'email cannot be null')
        }
        let data = await db('activities').insert({
            email,
            title,
            created_at: new Date()
        })
        let cek =  await redis.get('dataall')
        let newData = await getOneFullQuery(data[0])
        if (cek !== null) {
            cek = JSON.parse(cek)
            cek.push(newData[0])
            await updateCache(cek)
        } else {
            await updateCache([newData[0]])
        }
        return templateResponse('Success', false, 'Success', newData[0], undefined, 201)
    } catch (error) {
        console.log({error});
        return templateResponse('System Error', false)
    }
}

exports.patchData = async (id, email, title, ) => {
    try { 
        if (h.checkNullQueryAll(id)) {
            return templateResponse('Success', false, 'Success')
        }
        let existing = await getOneFullQuery(id)
        if (h.checkNullQueryAllExtended(existing)) {
            return templateResponse('Not Found', false, `Activity with ID ${id} Not Found`, {})
        }
        let data = await db('activities').whereRaw(`id = ? and deleted_at is null`, [id]).update({
            email: h.checkNullQueryAll(email) ? existing[0].email: email,
            title: h.checkNullQueryAll(title) ? existing[0].title: title,
            updated_at: new Date()
        })
        let cek =  await redis.get('dataall')
        cek = JSON.parse(cek)
        if (cek !== null) {
            for (let index = 0; index < cek.length; index++) {
                const dataI = cek[index];
                if (dataI.id == id) {
                    dataI.email = h.checkNullQueryAll(email) ? existing[0].email: email
                    dataI.title = h.checkNullQueryAll(title) ? existing[0].title: title
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