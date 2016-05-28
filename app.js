var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    app = express();

mongoose.connect('mongodb://localhost/blogger_data');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));




var blogSchema = new mongoose.Schema({

    title: String,
    image: String,
    body: String,
    createdDate : {type:Date , default: Date.now}

    });

var Blog = mongoose.model('Blog',blogSchema);

// Blog.create({
//     title: "Winona Ryder",
//     image: 'http://science-all.com/images/winona-ryder/winona-ryder-02.jpg',
//     body: "Hi there,",

// });


app.get('/', function(req, res){
    res.redirect('/blogs');
})

app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            res.redirect('/blogs');
        }else {
            res.render('index', {blogs:blogs});
        }
    })

});

app.get('/blogs/new', function(req, res){
    res.render('new');
});


app.post('/blogs', function(req, res){

    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.redirect('/blogs/new');
        }else {
            res.redirect('/blogs')
        }
    })
    console.log(req.body);
})

app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            res.redirect('/blogs');
        }else {
            res.render('show', {blog : blog});
        }
    })
})


app.get('/blog/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect('/blogs/:id');
       } else {
           res.render('edit', {blog : foundBlog});
       }
    });

})

app.put('/blog/:id', function(req, res){
   Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err, blog){
       if(err){
           console.log(err);
       } else {
           res.redirect('/blogs/'+req.params.id);
       }
   })
});

app.delete('/blogs/:id', function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        } else {
            res.redirect('/blogs');
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server started ....');
})
