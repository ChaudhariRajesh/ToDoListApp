const express = require("express");
const bodyParser = require("body-parser");
const dateModule = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://RajeshChaudhari:rajeshmongoaws@cluster0.w75fi7b.mongodb.net/todolistDB");

const listItemSchema = {
  item : {
    type : String,
    required : [true,"Please specify task name"]
  }
};

const listItemModel = mongoose.model("Item",listItemSchema);

const taskOne = new listItemModel({
  item : "Task 1"
});
const taskTwo = new listItemModel({
  item : "Task 2"
});
const taskThree = new listItemModel({
  item : "Task 3"
});

let tasksArray = [taskOne, taskTwo, taskThree];

const customList = {
  name : String,
  items : [listItemSchema]
};

const customListModel = mongoose.model("customNewList",customList);

app.get("/",function(req,res){

  listItemModel.find({}, function(err, listItems){
    if(err)
    {
      console.log("Got find error!!!!");
    }
    else
    {
      if(listItems.length === 0)
      {
        listItemModel.insertMany(tasksArray,function(err){
          if(err)
          {
            console.log("Got insert error!!!!");
          }
          else
          {
            console.log("Successfully inserted");
          }
        });
        res.redirect("/");
      }
      else
      {
        res.render("list",{day : "Today", itemsList : listItems});
      }
    }
  });
});

app.get("/:newList", function(req,res)
{
  const newListName = _.capitalize(req.params.newList);

  customListModel.findOne({name : newListName}, function(err,result){
    if(!err)
    {
      if(!result)
      {
        const list = new customListModel({
          name : newListName,
          items : tasksArray
        });
        list.save();
        res.redirect("/" + newListName);
      }
      else
      {
        res.render("list",{day : newListName, itemsList : result.items});
      }
    }
  });
});

app.get("/about",function(req,res){
  res.render("about");
});

app.post("/delete",function(req,res)
{
  const deleteItemId = req.body.checkbox;
  const listName = req.body.hiddenListName;

  if(listName === "Today")
  {
    listItemModel.findByIdAndRemove(deleteItemId, function(err)
    {
      if(err)
      {
        console.log("Got delete error!!!!");
      }
      else
      {
        res.redirect("/");
      }
    });
  }
  else
  {

    customListModel.findOneAndUpdate({name : listName}, {$pull: {items : { _id : deleteItemId}}}, function(err, result){
      if(!err)
      {
        console.log(deleteItemId, result);
        res.redirect("/" + listName);
      }
    });
  }

});

app.post("/",function(req,res){
  //toDoList.push(req.body.listItemInput);

  const newTask = req.body.listItemInput;
  const listName = req.body.addToDoButton;

  const newListItem = new listItemModel({
    item : newTask
  });

  console.log(newTask,listName);
  if(listName === "Today")
  {
    newListItem.save();
    res.redirect("/");
  }
  else
  {
    customListModel.findOne({name : listName}, function(err, result)
    {
      result.items.push(newListItem);
      result.save();
      res.redirect("/" + listName);
    });
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
  console.log("Server is listening on 3000");
});
