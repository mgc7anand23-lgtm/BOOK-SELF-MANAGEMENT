const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();

const BookModel = require("./models/BookModel");

mongoose
  .connect("mongodb://127.0.0.1:27017/bookdb")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

app.use(express.urlencoded({ extended: true })); 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/", async (req, res) => {
  try {
    const books = await BookModel.find({});
    const { status, edit_id, delete_id } = req.query;

    if (delete_id) {
      await BookModel.findByIdAndDelete(delete_id);
      return res.redirect("/?status=3");
    }

    const messages = {
      "1": "Inserted Successfully!",
      "2": "Updated Successfully!",
      "3": "Deleted Successfully!",
    };

    const edit_book = edit_id ? await BookModel.findById(edit_id) : null;

    res.render("index", {
      books,
      message: messages[status] || "",
      edit_id,
      edit_book,
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/store_book", async (req, res) => {
  try {
    await BookModel.create(req.body);
    res.redirect("/?status=1");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/update_book/:edit_id", async (req, res) => {
  try {
    await BookModel.findByIdAndUpdate(req.params.edit_id, req.body);
    res.redirect("/?status=2");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});


app.listen(8000, () => {
  console.log("Server running at http://localhost:8000");
});
