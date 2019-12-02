const app = require('express')()
const path = require('path');
app.use(require('express').static('dist'));
app.use('/', (req, res) => {
    res.sendFile('index.html', {
        root: path.join(__dirname, './dist')
    });
});

app.listen(7777);
