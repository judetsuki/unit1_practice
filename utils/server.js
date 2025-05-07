import express from 'express'
const app = express()
const port = 5000

app.get('https://dan-vlad2015-5d1657a5-f85d-475a-8480-9a609031ef5f.socketxp.com/tasks', (req, res) => {
    console.log(req, res)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
