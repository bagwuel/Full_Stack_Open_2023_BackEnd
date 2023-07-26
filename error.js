
const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({ error: 'Validation error: number pattern xx-xxxxxx... or xxx-xxxxxxx...' })
    }
    next(error)
}

module.exports = errorHandler