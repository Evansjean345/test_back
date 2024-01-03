const express = require("express");
const app = express();
const port = 4000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { checkUser, requireAuth } = require("./middlewares/auth");
const UserRoutes = require("./routes/user.routes");
const EntrepotRoutes = require("./routes/entrepot.routes")


app.get("/", (req, res) => res.send("Hello World!"));
const server = app.listen(process.env.PORT || port, () =>
  console.log(`Example app listening on port ${port}!`)
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//connect to database
//not change the Username

  /*
  const db1 = mongoose.createConnection(
  "mongodb+srv://evansJean:Azerty0987@cluster0.a2k1t6d.mongodb.net/dilam?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

db1.on("error", (err) => {
  console.error("Connection error:", err.message);
});

db1.once("open", () => {
  console.log("Database connected 1" + db1);
});

const db2 = mongoose.createConnection(
  "mongodb+srv://evansJean:Azerty0987@cluster0.a2k1t6d.mongodb.net/caauri?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

db2.on("error", (err) => {
  console.error("Connection error:", err.message);
});

db2.once("open", () => {
  console.log("Database connected 2" + db2);
}); */

mongoose
  .connect(
    "mongodb+srv://evansJean:Azerty0987@cluster0.a2k1t6d.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((res) => console.log(`database connecting  ${res}`))
  .catch((err) => console.log(`connection failed ${err.message}`));




//routes from connected user

app.use("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user.id);
});

//routes from api
app.use(UserRoutes);
app.use(EntrepotRoutes);


