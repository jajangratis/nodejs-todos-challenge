const activitiesGroup = require('./components/activities-group')
const todoItems = require('./components/todo-items')

converter = {
    Success: 200,
    'Not Found': 404,
    'Bad Request': 400,
    'System Error': 500,
    'Added': 201,
}

exports.getAll = async(req, res) => {
    let result = await activitiesGroup.getAlldata()
    return res.status(converter[result.status]).json(result);
}

exports.getOne = async(req, res) => {
    const id = req.params.id
    let result = await activitiesGroup.getOne(id)
    return res.status(converter[result.status]).json(result);
}

exports.deleteOne = async(req, res) => {
    const id = req.params.id
    let result = await activitiesGroup.deleteOne(id)
    return res.status(converter[result.status]).json(result);
}

exports.postOne = async(req, res) => {
    const {email, title} = req.body
    let result = await activitiesGroup.postData(email, title)
    return res.status(result.code !== undefined ? 201 : converter[result.status]).json(result);
}

exports.patchOne = async(req, res) => {
    const id = req.params.id
    const {email, title} = req.body
    let result = await activitiesGroup.patchData(id, email, title)
    return res.status(converter[result.status]).json(result);
}

// TODO ITEMS
exports.getTodoAll = async(req, res) => {
    let {activity_group_id} = req.query
    let result = await todoItems.getAlldata(activity_group_id)
    return res.status(converter[result.status]).json(result);
}

exports.getTodoOne = async(req, res) => {
    const id = req.params.id
    let result = await todoItems.getOne(id)
    return res.status(converter[result.status]).json(result);
}

exports.deleteTodoOne = async(req, res) => {
    const id = req.params.id
    let result = await todoItems.deleteOne(id)
    return res.status(converter[result.status]).json(result);
}

exports.postTodoOne = async(req, res) => {
    const {activity_group_id, title, priority} = req.body
    let result = await todoItems.postData(activity_group_id, title, priority)
    return res.status(result.code !== undefined ? 201 : converter[result.status]).json(result);
}

exports.patchTodoOne = async(req, res) => {
    const id = req.params.id
    const {activity_group_id, title, priority, is_active} = req.body
    let result = await todoItems.patchData(id, activity_group_id, title, priority, is_active)
    return res.status(converter[result.status]).json(result);
}