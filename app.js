const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')

// take express in app
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




mongoose.connect("mongodb://localhost:27017/todoDB", { useNewUrlParser: true });

const itemsSchema = {
    name: String
};


const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "reding book in morning  time with the cup of tea and office meeting"
})
const item2 = new Item({
    name: "going to hotel with family "
})
const defaultsIteams = [item1, item2];


app.get("/", function(req, res) {


    Item.find({}, function(err, FoundItem) {

        if (FoundItem.length === 0) {
            Item.insertMany(defaultsIteams, function(err) {
                if (err) {
                    console.log(err)
                } else { console.log("successfully") }
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", newListItems: FoundItem });
        }


    })

});

app.post("/", function(req, res) {

    const itemN = req.body.newItem;

    const item = new Item({ name: itemN });
    item.save();
    res.redirect("/");


});

app.post("/delete", function(req, res) {
    // console.log(req.body.checkBox);

    const checkBoxIteamID = req.body.checkBox
    Item.findByIdAndRemove(checkBoxIteamID, function(err) {
        if (!err) {
            // console.log("success to delete item");

        }
    })

    Item.find({}, function(err, FoundItem) {

        if (FoundItem.length === 0) {
            Item.insertMany(defaultsIteams, function(err) {
                if (err) {
                    console.log(err)
                } else {
                    // console.log("successfully")
                }
            });

        } else {
            res.render("list", { listTitle: "Today", newListItems: FoundItem });
        }


    })


})

app.get("/work", function(req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000)