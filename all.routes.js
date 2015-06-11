var AllRoutes = function(app) {
  require("./routes/Lists.routes")(app);
  require("./routes/ManualEvaluations.routes")(app);
  require("./routes/TfIdf.routes")(app);
  require("./routes/Test.routes")(app);
}
module.exports = AllRoutes;
