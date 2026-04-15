# ShubhMilan AI 💞

### AI-Powered Personality Based Matchmaking Platform

ShubhMilan AI is a next-generation matrimonial platform that replaces traditional filter-based matching with **AI-driven personality matchmaking**. Instead of matching users using rigid filters like age or height, ShubhMilan understands **values, interes
1. Converts the query into vector embeddings
2. Compares it with stored profile vectors
3. Returns the most compatible profiles

---
ts, and lifestyle** through natural language and semantic search.

Built during a **6-hour hackathon sprint**, the platform uses **Generative AI + Vector Search** to deliver more meaningful compatibility.

---

# 🚀 Core Idea

Traditional matchmaking platforms rely on filters such as:

* Age
* Height
* Religion
* Location

ShubhMilan AI instead understands queries like:

> *"Someone who loves sci-fi, respects personal space, and enjoys weekend treks."*

The system converts this description into **vector embeddings** and finds the most compatible profiles using **semantic similarity**.

---

# 🧠 Key Features

### 1️⃣ Semantic Matchmaking (Soulmate Scout)

Users can search for partners using natural language.

Example query:

```
Someone who enjoys books, trekking, and quiet weekends.
```

The system:

1. Converts the query into vector embeddings
2. Compares it with stored profile vectors
3. Returns the most compatible profiles

---

### 2️⃣ AI Bio Writer

Users can generate a polished matrimonial bio from simple bullet points.

Example input:

```

* Date of birth
* Time of birth
* Place of birth

The AI generates:

* Sun sign
* Moon sign
* A short personality reading for their profile.

coder, gym, foodie, trekking
```

The AI converts it into a **professional and engaging profile bio**.

---

### 3️⃣ AI Icebreaker Generator


* Date of birth
* Time of birth
* Place of birth

The AI generates:

* Sun sign
* Moon sign
* A short personality reading for their profile.

When viewing a match, users can generate **conversation starters** based on shared interests.

Example output:

* “I saw you enjoy trekking. What’s your favorite trail so far?”
* “You mentioned sci-fi books. Have you read Dune?”

---

### 4️⃣ AI Horoscope Generator

Users provide:

* Date of birth
* Time of birth
* Place of birth

The AI generates:

* Sun sign
* Moon sign
* A short personality reading for their profile.

---

### 5️⃣ Trust & Verification System

Users upload ID documents (Aadhaar/PAN) for verification.

Admins can:

* Approve profiles
* Reject documents
* Grant a **verified badge**

---

### 6️⃣ Interest / Connection System

Users can:

* Send interests
* Accept or decline requests
* View sent and received connections

---

# 🏗 System Architecture

```
React Frontend
      ↓
FastAPI Backend
      ↓
LangChain
      ↓
Google Gemini (LLM)
      ↓
Embedding Model
      ↓
ChromaDB (Vector Search)
      ↓
MongoDB (User Data)
```

---

# 🛠 Tech Stack

| Layer            | Technology              | Purpose                             |
| ---------------- | ----------------------- | ----------------------------------- |
| Frontend         | React + TailwindCSS     | UI & user interaction               |
| Backend          | FastAPI                 | REST API and AI integration         |
| AI Orchestration | LangChain               | Managing prompts & embeddings       |
| LLM              | Google Gemini           | Bio writing, astrology, icebreakers |
| Embeddings       | Google `embedding-001`  | Semantic vector generation          |
| Vector Database  | ChromaDB                | Personality-based matchmaking       |
| Primary Database | MongoDB                 | User profiles & interests           |
| Authentication   | JWT                     | Secure user sessions                |
| Storage          | Local `/static/uploads` | ID document storage                 |

---

# ⚙️ How Matchmaking Works

### Step 1 — Profile Embedding

When a user creates a profile:

```
User Bio → Embedding Model → Vector
```

The vector is stored in **ChromaDB**.

---

### Step 2 — Search Query

User searches:

```
"Someone who loves trekking and reading"
```

The system converts this query into a vector.

---

### Step 3 — Vector Similarity

```
Query Vector
     ↓
ChromaDB Similarity Search
     ↓
Top 5 Matching Profiles
```

Matches are returned based on **cosine similarity**.

---

# 📂 Project Structure

```
ShubhMilan-ai
│
├── backend
│   ├── main.py
│   ├── routes
│   ├── services
│   ├── models
│   └── ai
│
├── frontend
│   ├── components
│   ├── pages
│   └── api
│
├── chroma_db
│
├── static
│   ├── uploads
│   └── photos
│
└── README.md
```

---

# 🔐 Authentication & Roles

### User

Can:

* Create profile
* Search matches
* Send interests
* Use AI features

### Admin

Can:

* Verify users
* Approve ID documents
* Remove inappropriate profiles

JWT tokens contain a **role claim** used for access control.

---

# 📡 Key API Endpoints

### Authentication

```
POST /auth/register
POST /auth/login
```

### Matchmaking

```
GET /matches?q=...
```

### AI Features

```
POST /ai/enhance-bio
POST /ai/icebreakers
POST /generate-astrology
```

### Interests

```
POST /interests
GET /interests/sent
GET /interests/received
PATCH /interests/{id}
```

### Admin

```
GET /admin/pending-verifications
PATCH /admin/verify/{user_id}
```

---

# 🧪 Running the Project

### 1️⃣ Clone the Repository

```
git clone https://github.com/yourusername/ShubhMilan-ai.git
cd ShubhMilan-ai
```

---

### 2️⃣ Backend Setup

```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

# 🎯 Hackathon Highlights

* AI-driven matchmaking using **vector similarity**
* Natural language partner search
* Generative AI features for bios and conversation starters
* AI-generated horoscope insights
* Verification system for trust and authenticity

---

# 📈 Future Improvements

* Real compatibility scoring system
* Chat system for matched users
* Real astrology API integration
* Cloud file storage (AWS S3 / GCP)
* AI compatibility reports
* Mobile app support

---

# 👨‍💻 Built For

**AI Hackathon — 6 Hour Sprint**

The goal was to demonstrate how **Generative AI + Vector Search** can transform traditional matchmaking into **personality-driven compatibility matching**.

---

# ❤️ ShubhMilan AI

> Finding meaningful connections through intelligence, not filters.
