//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Jatin:test123@cluster0.dkelqnf.mongodb.net/todolistDB");

const itemsSchema={
  name:String
};

const Item = mongoose.model("Item",itemsSchema);
const Item1=new Item({
  name:"This"
});
const Item2=new Item({
  name:"is a"
});
const Item3=new Item({
  name:"ToDo List"
});

const defaultItems = [Item1,Item2,Item3];

// const listSchema={
//   name:String,
//   items:[itemsSchema]
// };
//
// const List = mongoose.model("List",listSchema);

app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){
    if (foundItems.length==0){
      Item.insertMany(defaultItems,function(err){
        if (err){
          console.log(err);
        }else {
          console.log("success");
        }
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });

});

// app.get("/:customListName",function(req,res){
//   const customListName = req.params.customListName;
//
//   const list=new List({
//     name: customListName,
//     items: defaultItems
//   });
//   list.save();
// });

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item=new Item({
    name:itemName
  });
  item.save();

  res.redirect("/");


  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
      console.log("success in deletion");
      res.redirect("/");
    }
  });
});

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/about", function(req, res){
  res.render("about");
});

// let port = process.env.PORT;
// if (port == null || port == ""){
//   port = 3000;
// }
// app.listen(port);

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
