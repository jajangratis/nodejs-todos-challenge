const express = require('express');

const db = require('../config/database');
const h = require('../helpers/helper')
 

// middleware
// const tokenExtractorMiddleware = require('../middleware/token-extractor')
// const inputMiddleware = require('../middleware/input-filter')

const router = express.Router()
/**
 * Controller
 */
const Controller = require('../api/module/moduleController')


router.get('/', (req, res) => {
    return 'ok'
})

router.get('/activity-groups', Controller.getAll)
router.get('/activity-groups/:id', Controller.getOne)
router.post('/activity-groups', Controller.postOne)
router.delete('/activity-groups/:id', Controller.deleteOne)
router.patch('/activity-groups/:id', Controller.patchOne)

router.get('/todo-items', Controller.getTodoAll)
router.get('/todo-items/:id', Controller.getTodoOne)
router.post('/todo-items', Controller.postTodoOne)
router.delete('/todo-items/:id', Controller.deleteTodoOne)
router.patch('/todo-items/:id', Controller.patchTodoOne)

module.exports = router;