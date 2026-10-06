# 🏨 BookingLK

A modern hotel booking platform built with **Next.js**, designed to help users discover hotels, explore rooms, make reservations, and manage their bookings through a secure and responsive web application.

---

## ✨ Features

### 👤 User Features

* User registration and login
* Secure authentication using JWT
* Password hashing before storing in the database
* User profile management
* Browse published hotels
* Search hotels
* Filter hotels by:

  * Location
  * City
  * Property type
  * Price range
  * Rating
* Sort hotels by:

  * Recommended
  * Price low to high
  * Price high to low
  * Rating
* Explore hotels on an interactive map
* View hotel details
* View available rooms
* Select check-in and check-out dates
* Select number of guests
* Create hotel bookings
* Add special requests
* Booking confirmation
* Responsive mobile and desktop interface

### 🏨 Hotel Features

* Hotel information management
* Room management
* Room types
* Room pricing
* Room capacity
* Bed information
* Hotel amenities
* Hotel images
* Hotel ratings and reviews
* Hotel location and coordinates
* Published/unpublished hotel status

### 🔐 Security Features

* JWT-based authentication
* HTTP-only authentication cookies
* Password hashing
* Protected API routes
* User session verification
* Active account validation
* Server-side authentication checks
* MongoDB database access through Mongoose
* Input validation and error handling
* Sensitive password fields excluded from user responses

---

## 🛠️ Technologies

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Framer Motion**
* **Lucide React**

### Backend

* **Next.js API Routes**
* **Node.js**
* **MongoDB**
* **Mongoose**

### Authentication

* **JWT (JSON Web Token)**
* HTTP-only cookies
* Password hashing

### Maps

* **Leaflet**
* Dynamic map loading with Next.js

---

## 🏗️ Architecture

BookingLK uses a full-stack Next.js architecture.

```text
┌─────────────────────────────┐
│          Frontend           │
│                             │
│ React + Next.js + TypeScript│
│ Tailwind CSS + Framer Motion│
└──────────────┬──────────────┘
               │
               │ API Requests
               ▼
┌─────────────────────────────┐
│        Next.js API          │
│                             │
│ Authentication              │
│ Hotels                      │
│ Rooms                       │
│ Bookings                    │
│ Users                       │
└──────────────┬──────────────┘
               │
               │ Mongoose
               ▼
┌─────────────────────────────┐
│          MongoDB            │
│                             │
│ Users                       │
│ Hotels                      │
│ Rooms                       │
│ Bookings                    │
└─────────────────────────────┘
```

---

## 🔐 Authentication Flow

BookingLK uses JWT authentication with an HTTP-only cookie.

```text
User Login
    ↓
Credentials Validation
    ↓
Password Verification
    ↓
JWT Token Generated
    ↓
HTTP-only Cookie
    ↓
Protected API Request
    ↓
JWT Verification
    ↓
User Retrieved From MongoDB
```

The authentication API verifies the `bookinglk_token` cookie before allowing access to protected user information.

Passwords are **never stored as plain text** in the database. They are hashed before being stored.

---

## 📱 Responsive Design

BookingLK is designed for both mobile and desktop devices.

The project uses **Tailwind CSS responsive breakpoints** rather than relying on server-side device detection.

Example:

```tsx
<aside className="hidden lg:block">
  <ExploreFilters />
</aside>

<div className="lg:hidden">
  <ExploreFilters />
</div>
```

This allows the interface to automatically adapt according to the user's viewport size.

### Supported Layouts

* 📱 Mobile
* 📱 Tablet
* 💻 Laptop
* 🖥️ Desktop

---

## 🗺️ Hotel Map

The Explore page includes an interactive map powered by Leaflet.

Hotels with valid latitude and longitude coordinates can be displayed on the map.

Hotel location data follows a GeoJSON-style structure:

```json
{
  "coordinates": [
    80.6337,
    7.2906
  ]
}
```

The map is dynamically loaded on the client side to avoid server-side rendering issues.

---

## 📂 Project Structure

```text
BookingLK/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── hotels/
│   │   ├── rooms/
│   │   └── bookings/
│   │
│   ├── hotels/
│   ├── explore/
│   ├── booking/
│   └── ...
│
├── components/
│   ├── hotel/
│   ├── explore/
│   ├── navbar/
│   └── ...
│
├── lib/
│   ├── auth/
│   └── db/
│
├── models/
│   ├── User.ts
│   ├── Hotel.ts
│   ├── Room.ts
│   └── Booking.ts
│
├── public/
│   └── images/
│
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Go to the project directory:

```bash
cd BookingLK
```

Install dependencies:

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root.

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

### Example

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookinglk
JWT_SECRET=your-super-secure-secret-key
```

> Never commit `.env.local` or database credentials to GitHub.

---

## ▶️ Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 📦 Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## 🔒 Security Practices

The project follows several security practices:

### Password Protection

User passwords are hashed before database storage.

```text
Plain Password
      ↓
Password Hashing
      ↓
Hashed Password
      ↓
MongoDB
```

The original password is not stored.

### JWT Authentication

Authenticated users receive a JWT stored in an HTTP-only cookie.

```text
bookinglk_token
```

The server verifies this token before returning protected user information.

### Protected User API

Example authentication flow:

```text
GET /api/auth/me
       ↓
Check bookinglk_token
       ↓
Verify JWT
       ↓
Find User
       ↓
Check Active Status
       ↓
Return User Data
```

Password information is excluded from the returned user object.

---

## 📊 Main API Modules

| Module                     | Purpose                          |
| -------------------------- | -------------------------------- |
| `/api/auth`                | Authentication and user sessions |
| `/api/hotels`              | Hotel data                       |
| `/api/hotels/[slug]/rooms` | Hotel rooms                      |
| `/api/bookings`            | Create and manage bookings       |

---

## 🧾 Booking Flow

```text
Explore Hotels
      ↓
Select Hotel
      ↓
Select Room
      ↓
Choose Check-in / Check-out
      ↓
Select Guests
      ↓
Enter Guest Details
      ↓
Review Price
      ↓
Accept Booking Terms
      ↓
Confirm Booking
      ↓
Booking Created
      ↓
Confirmation Page
```

---

## 💰 Booking Calculation

The booking total is calculated based on the room price and number of nights.

```text
Room Total
= Room Price Per Night × Number of Nights

Service Fee
= Room Total × 5%

Final Total
= Room Total + Service Fee
```

Example:

```text
Room Price = LKR 10,000
Nights     = 3

Room Total = LKR 30,000
Service Fee = LKR 1,500

Total = LKR 31,500
```

---

## 🎨 UI & UX

BookingLK uses a modern premium hotel-booking design with:

* Dark and light mode support
* Gold accent colors
* Responsive layouts
* Smooth animations
* Loading skeletons
* Interactive filters
* Mobile-friendly navigation
* Interactive maps
* Clear booking flow
* Error states
* Empty states
* Secure booking indicators

---

## 🚀 Future Improvements

Planned features include:

* 💳 Online payment integration
* ⭐ Hotel reviews and ratings
* ❤️ Favorite hotels
* 📧 Booking confirmation emails
* 📱 User booking history
* 🔔 Notifications
* 🏨 Hotel owner dashboard
* 📊 Admin dashboard
* 💰 Payment management
* 🧾 Downloadable booking invoices
* 🔐 Two-factor authentication
* 🛡️ Advanced API rate limiting
* 🔎 Advanced hotel availability checking

---

## 👨‍💻 Development

This project was developed as a full-stack web application to demonstrate modern web development concepts including:

* Frontend development
* Backend API development
* Database management
* Authentication
* Authorization
* REST API integration
* Responsive web design
* Security
* Booking management
* Map integration

---

## 📄 License

This project is intended for educational and development purposes.

---

## 👤 Developer

**Sashika Madushan**

Software Engineering Undergraduate
NIBM – Sri Lanka

---

⭐ If you like this project, consider giving it a star on GitHub.
