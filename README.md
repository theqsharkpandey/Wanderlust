# 🌍 Wanderlust

A full-stack travel accommodation listing platform inspired by Airbnb. Users can browse, create, and manage property listings with interactive maps, image uploads, user authentication, and a review system.

---

## ✨ Features

- **User Authentication** — Sign up, log in, and log out with session-based auth via Passport.js
- **Listing Management (CRUD)** — Create, read, update, and delete property listings
- **Image Uploads** — Upload listing images via Cloudinary
- **Interactive Maps** — Every listing is geocoded and displayed on a Leaflet.js map powered by Geoapify
- **Reviews & Ratings** — Leave star-rated reviews on listings; delete your own reviews
- **Category Filtering** — Filter listings by categories: Trending, Rooms, Iconic Cities, Mountains, Castles, Amazing Pools, Camping, Farms, Arctic
- **Search** — Search listings by title (case-insensitive)
- **Authorization** — Only listing owners can edit or delete their listings; only review authors can delete their reviews
- **Flash Notifications** — Success and error messages on all key actions
- **Responsive UI** — Bootstrap 5 responsive design with Font Awesome icons

---

## 🛠️ Tech Stack

| Layer        | Technology                                      |
|--------------|-------------------------------------------------|
| Runtime      | Node.js 22                                      |
| Framework    | Express.js v5                                   |
| Database     | MongoDB with Mongoose ODM                       |
| Templating   | EJS + ejs-mate                                  |
| CSS          | Bootstrap 5.3, Font Awesome 7                   |
| Maps         | Leaflet.js v1.9.4 + Geoapify Geocoding API      |
| Image Upload | Cloudinary + Multer                             |
| Auth         | Passport.js (Local Strategy)                    |
| Sessions     | express-session + connect-mongo                 |
| Validation   | Joi                                             |

---

## 📁 Project Structure

```
Wanderlust/
├── app.js                  # Express app entry point
├── cloudConfig.js          # Cloudinary configuration
├── middleware.js           # Custom auth & validation middleware
├── schema.js               # Joi validation schemas
├── package.json
│
├── controllers/
│   ├── listings.js         # Listing CRUD + geocoding logic
│   ├── reviews.js          # Review creation & deletion
│   └── users.js            # Signup, login, logout
│
├── models/
│   ├── listing.js          # Listing schema (with GeoJSON geometry)
│   ├── review.js           # Review schema
│   └── user.js             # User schema (Passport-Local-Mongoose)
│
├── routes/
│   ├── listing.js          # /listings RESTful routes
│   ├── review.js           # /listings/:id/reviews routes
│   └── user.js             # /signup, /login, /logout routes
│
├── views/
│   ├── layouts/boilerplate.ejs
│   ├── includes/           # navbar, footer, flash partials
│   ├── listings/           # index, new, edit, show templates
│   └── users/              # signup, login templates
│
├── public/
│   ├── css/                # Custom stylesheets
│   └── js/                 # Client-side scripts & Leaflet map init
│
├── utils/
│   ├── ExpressError.js     # Custom error class
│   └── wrapAsync.js        # Async error handling wrapper
│
└── init/
    ├── index.js            # DB seeder entry point
    └── data.js             # Sample listing data
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v22+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Cloudinary](https://cloudinary.com/) account
- [Geoapify](https://www.geoapify.com/) API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/theqsharkpandey/Wanderlust.git
   cd Wanderlust
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   MONGO_URL=mongodb://localhost:27017/wanderlust
   SESSION_SECRET=your_session_secret_here

   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET=your_cloudinary_api_secret

   MAP_TOKEN=your_geoapify_api_key
   ```

4. **(Optional) Seed the database**

   ```bash
   node init/index.js
   ```

### Running the App

**Development** (with auto-reload via nodemon):

```bash
npm run dev
```

**Production:**

```bash
npm start
```

The server starts on **[http://localhost:8080](http://localhost:8080)**.

---

## 🗺️ Routes Overview

| Method | Route                          | Description                     |
|--------|--------------------------------|---------------------------------|
| GET    | `/listings`                    | View all listings                |
| GET    | `/listings/new`                | New listing form                 |
| POST   | `/listings`                    | Create a new listing             |
| GET    | `/listings/:id`                | View a single listing            |
| GET    | `/listings/:id/edit`           | Edit listing form                |
| PUT    | `/listings/:id`                | Update a listing                 |
| DELETE | `/listings/:id`                | Delete a listing                 |
| POST   | `/listings/:id/reviews`        | Add a review                     |
| DELETE | `/listings/:id/reviews/:rid`   | Delete a review                  |
| GET    | `/signup`                      | Signup form                      |
| POST   | `/signup`                      | Register a new user              |
| GET    | `/login`                       | Login form                       |
| POST   | `/login`                       | Authenticate user                |
| GET    | `/logout`                      | Log out                          |

---

## 🌐 Deployment

The app is configured for deployment on [Render](https://render.com/):

- `app.set("trust proxy", 1)` is set for HTTPS support
- Session cookies use `secure: true` and `sameSite: "none"` for cross-origin compatibility
- Set `NODE_ENV=production` in your hosting environment variables

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
