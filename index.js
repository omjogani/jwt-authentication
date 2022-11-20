const app = require("./app");
const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`SERVER is Running at PORT: ${PORT}`);
});
