const serve = require('serve');
const path = require('path');

const port = process.env.PORT || 3000;

serve(path.join(__dirname, 'dist'), {
    port: port,
    ignore: ['node_modules']
});
