var express          = require("express"),
    mongoose         = require("mongoose"),
    bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app              = express();

//App Config
mongoose.connect("mongodb://localhost/restfull_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Mongoose Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//Restful Routes

app.get("/", (req, res) =>{
    res.redirect("/blogs");
});

//Index Route
app.get("/blogs", (req, res) =>{
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});

//New Post Route
app.get("/blogs/new", (req, res) =>{
    res.render("new");
});

//Create Post Route
app.post("/blogs", (req, res) =>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newPost){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
});

//Show Route
app.get("/blogs/:id", (req, res) =>{
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog : foundBlog});
        }
    });
});

//Edit Route
app.get("/blogs/:id/edit", (req, res) =>{
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog : foundBlog});
        }
    });
});

//Update Route
app.put("/blogs/:id", (req, res) =>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//Update Route
app.delete("/blogs/:id", (req, res) =>{
    Blog.findByIdAndRemove(req.params.id,function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server is running!");
});
