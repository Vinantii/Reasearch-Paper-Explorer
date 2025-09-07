# Research Paper Explorer
A professional, minimalist web application to search, filter, and explore scholarly research papers using OpenAlex API. Users can also submit queries or feedback via a contact form, with data stored securely in MongoDB Atlas.

## Features 

**Keyword Search:**
- Search papers by title, keywords, or topics.

**Filters:**
- Year range (Year From / Year To)
- Minimum citation count
- Open Access Only toggle

**Paper Cards:**
- Display title, authors, year, venue, citation count, DOI, and PDF link
- Clickable cards for full paper metadata

**Paper Details Page:**
- Full abstract
- All authors
- Citation count
- References list with clickable links
- DOI & PDF links

**Landing Page:**
- Professional search interface with header, footer, and filters

**Contact Form:**
- Users can submit queries, which are stored in MongoDB Atlas


## 🛠 Tech Stack
**Frontend:** 
- HTML, CSS, Bootstrap, EJS templates

**Backend:**
- Node.js, Express

**Database:**
- MongoDB Atlas (cloud-hosted)

**External APIs:**
- OpenAlex (metadata, citations, PDF links)

**HTTP Client:**
- Axios


## Project Structure
research-paper-explorer/
│
├─ views/
│   ├─ search.ejs          # Landing page with search & filters
│   ├─ papers.ejs          # Page displaying paper cards
│   ├─ paper-detail.ejs    # Full metadata for a single paper
│
├─ public/                 # Optional: CSS/JS files
├─ app.js                  # Main server file
├─ package.json
└─ README.md


## ⚡Installation & Setup

**Clone the repository**
- git clone https://github.com/yourusername/research-paper-explorer.git
- cd research-paper-explorer


**Install dependencies**
- npm install


**Dependencies include:**
- express
- ejs
- axios
- body-parser
- mongoose

## Set up MongoDB Atlas
- Create a free cluster on MongoDB Atlas
- Create a database user (username + password)
- Whitelist your IP (or allow 0.0.0.0/0 for testing)
- Copy the connection string and replace <username>, <password>, and <dbname>
- Example connection string:
- mongodb+srv://<username>:<password>@cluster0.mongodb.net/research_explorer?retryWrites=true&w=majority


## Connect MongoDB in Node.js
- const mongoose = require('mongoose');

- mongoose.connect('your_connection_string_here', {
  useNewUrlParser: true,
  useUnifiedTopology: true
 })
   .then(() => console.log("MongoDB connected"))
   .catch(err => console.error("MongoDB connection error:", err));


## Start the server
- node app.js


## Open in browser
- http://localhost:3000/api/search


## 🔍 How to Use
- Enter keywords in the search bar.
- (Optional) Apply filters: Year range, minimum citations, Open Access only.
- Click Search.
- Browse results in paper cards.
- Click a card or DOI to view full metadata, including abstract, authors, references, and PDF link.
- Submit queries via the Contact Form in the footer.


## 📬 Contact
For questions or feature requests:
Email: support@researchexplorer.com

## 📝 License
MIT License – Feel free to use and modify this project.