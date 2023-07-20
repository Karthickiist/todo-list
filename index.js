const express= require("express");
const bodyParser= require("body-parser");
const date=require("./package/time.js");
const mongoose=require("mongoose");


const app=express();
const PORT= process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:"false"}));
app.use(express.static(__dirname+"/public"));

app.set("view engine", "ejs");

const listSchema= {task: String};

mongoose.connect(process.env.MONGO_URL);

const List= mongoose.model("List",listSchema);
const CustList= mongoose.model("CustList", {custPage: String, tasks: [listSchema]})

app.get("/", (req, res)=>{
    List.find().then((data)=>{
        res.render("index", {listTitle: "Home", task: data});
    });
    
});

app.get("/:page", (req, res)=>{
    const _custPage= req.params.page;
    CustList.findOne({custPage: _custPage}).then((data)=>{
        if(!data){
            const newPage= new CustList({custPage: _custPage, tasks: {task: "List your Tasks"}});
            newPage.save();
            res.redirect("/"+_custPage);
        }else{
            res.render("index", {listTitle: _custPage, task: data.tasks});
        }
    });

    
});


app.post("/" , (req, res)=>{
    const task= new List({task: req.body.task});
    if (req.body.button === "Home"){
        task.save().then(()=>{});
        res.redirect("/");
    }else{
        CustList.findOne({custPage: req.body.button}).then((data)=>{
            data.tasks.push(task);
            data.save();
            res.redirect("/"+req.body.button)
        });
    }
})

app.post("/delete", (req,res)=>{
    const page= req.body.page;
    const task= req.body.task;
    if(page === "Home"){
        List.findByIdAndRemove(req.body.task).then(()=>{
            res.redirect("/");
        });
    }else{
       CustList.findOneAndUpdate({custPage: page},{$pull:{tasks:{_id:task}}}).then(()=>{
        res.redirect("/"+page);
       });
       
    }
    
});

app.listen(PORT, ()=>{
    console.log("listerning to port 3000...");
})