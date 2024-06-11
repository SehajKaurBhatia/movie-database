import express from "express"
import BodyParser from "body-parser"
import path from 'path'
import {fileURLToPath} from 'url'
import https from "https"
import axios from "axios"
import fs from "fs"
//since the url is of http we cannot use https instead use axios
const port=3000;
const app=express();
app.use(BodyParser.urlencoded({extended:true}));
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"/search.html"))
})
app.listen(port,()=>{
    console.log("server has started");
});
   

 app.post("/", (req, res) => {
    var movieName = req.body.search;
    const api = "f7fac88a";
    const url = "http://www.omdbapi.com/?apikey=" + api + "&s=" + movieName + "";

    // Read the HTML file
fs.readFile(path.join(__dirname, "details.html"), "utf8", (err, data) => {
    if (err) {
        console.error("Error reading HTML file:", err);
        res.status(500).send("Internal Server Error");
        return;
    }

     //axios auto parses data therefore response.on function is not required
    axios.get(url)
        .then((response) => {
            const movieInfo = response.data;
            const moviesHTML = movieInfo.Search.map(movie => `
                <div class="movie">
                    <h3>${movie.Title} (${movie.Year})</h3>
                    <img src="${movie.Poster}" alt="${movie.Title} Poster">
                </div>
                
            `).join("\n");

            // Replace placeholder in HTML data with movie HTML
            data= data.replace("<!-- movies-placeholder -->", moviesHTML);
            // Send the combined HTML-response 
            res.send(data);
        })
        .catch((error) => {
            console.error("Error fetching movie details:", error);
            res.status(500).send("Error fetching movie details");
        });
});
app.post("/details",(req,res)=>{
    res.redirect("/");
})

});


