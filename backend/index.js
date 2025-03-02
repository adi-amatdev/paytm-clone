const express = require("express");
const app = express();
const zod = require("zod");
const rootRouter = require("./routes/index");
const cors = require('cors')

app.use(express.json());    
app.use("/api/v1",rootRouter);
app.use(cors());
app.use(express.json());




app.listen(3000, () => {
    console.log("Server is running on port 3000");
}  );

