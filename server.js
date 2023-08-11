const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const mongooseConnect = require("./src/db/mongooseConnect");

const port = process.env.PORT || 3002;
const server = app.listen(port, async () => {
    console.log(`Lắng nghe cổng http://localhost:${port} ...`);
    mongooseConnect();
});