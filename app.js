const express = require('express');
const app = express();
const path = require('path')
const axios = require('axios')
const mongoose = require('mongoose')
app.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://vinantimhatre68_db_user:51N3q5Pxh42hLyLN@cluster0.bkizmny.mongodb.net/research_explorer?retryWrites=true&w=majority&appName=Cluster0", { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));


  const { Schema } = mongoose;

const querySchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Query = mongoose.model('Query', querySchema);

app.set("view engine", "ejs")


app.get("/", (req, res) => {
    res.send("root route")
})

app.get("/api/search", (req, res) => {
    res.render("search.ejs")
})

app.post("/api/papers", async (req, res) => {
  let keyword = req.body.search;
  let yearFrom = req.body.yearFrom;
  let yearTo = req.body.yearTo;
  let minCitations = req.body.minCitations;
  let openAccess = req.body.openAccess;

  try {
    // Build filter string dynamically
    let filters = [`title.search:${keyword}`];

    if (yearFrom && yearTo) {
      filters.push(`publication_year:${yearFrom}-${yearTo}`);
    } else if (yearFrom) {
      filters.push(`publication_year:>${yearFrom}`);
    } else if (yearTo) {
      filters.push(`publication_year:<${yearTo}`);
    }

    if (minCitations) {
      filters.push(`cited_by_count:>${minCitations}`);
    }

    if (openAccess === "true") {
      filters.push("is_oa:true");
    }

    const response = await axios.get("https://api.openalex.org/works", {
      params: {
        filter: filters.join(","),
        per_page: 10, // fetch up to 10 results
      },
    });

    const papers = response.data.results.map((paper) => ({
      id: paper.id,
      title: paper.display_name,
      authors: paper.authorships.map((a) => a.author.display_name),
      year: paper.publication_year,
      venue: paper.host_venue?.display_name || "N/A",
      citation_count: paper.cited_by_count,
      doi: paper.doi ? `https://doi.org/${paper.doi}` : "N/A",
      pdf_url: paper.open_access?.pdf_url || "N/A",
    }));

    console.log("Fetched Papers:", papers);
    res.render("papers.ejs", { papers });
  } catch (error) {
    console.error("Error fetching papers:", error.message);
    res.send("Error fetching papers.");
  }
});


app.get("/api/papers/:id", async(req, res) => {
 const paperId = decodeURIComponent(req.params.id); // e.g., W893234787

  try {
    const response = await axios.get(`https://api.openalex.org/works/${paperId}`);
    const paper = response.data;

    // Normalize
    const paperData = {
      title: paper.display_name,
      authors: paper.authorships.map(a => a.author.display_name),
      year: paper.publication_year,
      venue: paper.host_venue?.display_name || "N/A",
      citation_count: paper.cited_by_count,
      abstract: decodeAbstract(paper.abstract_inverted_index), // <-- fixed
      references: paper.referenced_works || [],
      doi: paper.doi ? `https://doi.org/${paper.doi}` : "N/A",
      pdf_url: paper.open_access?.pdf_url || "N/A"
    };

    function decodeAbstract(indexed) {
      if (!indexed) return "No abstract available";
      // Find max position number
      const maxPos = Math.max(...Object.values(indexed).flat());
      // Create empty array of correct length
      const words = new Array(maxPos + 1);
      // Fill positions with words
      for (const [word, positions] of Object.entries(indexed)) {
        positions.forEach(pos => {
          words[pos] = word;
        });
      }
      return words.join(" ");
    }
    
console.log("paperdata:",paperData)
    res.render('showPaper', { paper:paperData });
  } catch (error) {
    console.error(error);
    res.send("Error fetching paper metadata.");
  }
});



app.post("/api/contact", async(req, res) => {
  let { name, email, message } = req.body;
  const newQuery = new Query({ name, email, message })
  try {
     await newQuery.save()
     console.log("saved")
     res.redirect("/api/search")
  } catch (err) {
    console.log("error saving data")
  }
 
})

app.listen(8080, () => {
    console.log("Listening...")
})