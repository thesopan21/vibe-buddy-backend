# 🎧 Vibe Buddy Backend

The Vibe Buddy Backend is a scalable, high-performance backend built with Node.js, Express, and TypeScript. It powers the Vibe Buddy podcast listening platform and handles user authentication, podcast streaming, playlist management, and analytics.

## Why This Backend?

🚀 Optimized for High Performance – Handles large-scale podcast streaming.

🔒 Secure & Scalable – Robust authentication and database design.

🎧 User-Friendly Features – Personalized recommendations, seamless playback.

##  Key Features
1️⃣ User Authentication & Security

- JWT Authentication – Secure login and session management.
- Role-Based Access Control (RBAC) – Different permissions for listeners, creators, and admins.
- OAuth Integration – Supports Google/Facebook login (working on it).

2️⃣ Podcast & Audio Streaming
- Podcast Upload & Management – Allows creators to upload episodes with metadata.
- Adaptive Bitrate Streaming – Ensures smooth audio playback based on network conditions.
- Resume Listening – Saves playback progress for users.

3️⃣ Playlist & Favorites
- User Playlists – Users can create, edit, and share playlists.
- Favorites & Likes – Allows users to like and save episodes.
- Recently Played – Tracks listening history.

4️⃣ Notifications & Engagement (upcoming feature)
- Push Notifications – New episode alerts, creator updates.
- Comments & Reviews – Users can rate and review podcasts.
- Follow Creators – Get updates from favorite podcasters.

5️⃣ Performance & Optimization (upcoming feature)
- Caching with Redis – Faster API responses.
- MongoDB with Indexing – Optimized queries for large datasets.
- Rate Limiting – Prevents abuse of API requests.

6️⃣ Analytics & Insights (upcoming feature)
- Listener Stats – Track engagement, most played episodes.
- Ad Monetization – Tracks ad impressions and revenue.
- Admin Dashboard – View platform analytics.
- history tracking - to track the user engagement, mostly visited playlist/songs


### 1. To start the project in development mode, use the following

```bash
  npm run devserver
```

### 2. Build the Project

```bash
npm run build
```

### 3. To start the production-ready server using the compiled files:

```bash
npm start
```
