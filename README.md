<div align="center">
  <h1>Statu</h1>

  <p>
    <strong>The lightweight, modern, and open-source uptime monitoring system.</strong>
  </p>

  <p>
    <a href="https://github.com/Dev-Emree/Statu/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/Dev-Emree/Statu?style=flat-square&color=blue" alt="License" />
    </a>
    <a href="https://github.com/Dev-Emree/Statu/stargazers">
      <img src="https://img.shields.io/github/stars/Dev-Emree/Statu?style=flat-square" alt="Stars" />
    </a>
    <a href="https://github.com/Dev-Emree/Statu/issues">
      <img src="https://img.shields.io/github/issues/Dev-Emree/Statu?style=flat-square&color=orange" alt="Issues" />
    </a>
    <a href="https://github.com/Dev-Emree/Statu/pulls">
      <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
    </a>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#roadmap">Roadmap</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

<br />

## 👋 About Statu

**Statu** is a self-hosted uptime monitoring solution designed for developers who want simplicity without sacrificing power. It provides real-time monitoring for your HTTP/HTTPS services, TCP ports, and Ping responses, packaged in a beautiful and responsive interface.

Unlike heavy enterprise solutions, Statu focuses on **speed, minimalism, and ease of deployment**.

## ✨ Features

- ⚡ **Real-time Monitoring:** Monitor HTTP(s), TCP, Ping, and DNS records.
- 🎨 **Modern Dashboard:** Clean, responsive, and intuitive user interface.
- 🔔 **Instant Notifications:** Get alerted via Telegram, Discord, Slack, Email, and Webhooks when services go down.
- 📊 **Status Pages:** Public status pages to keep your users informed.
- 🐳 **Docker First:** Deploy in seconds using Docker.
- 🛡️ **Privacy Focused:** Your data stays on your server.

## 🛠 Tech Stack

Statu is built with modern web technologies to ensure performance and maintainability:

- **Backend:** Node.js (TypeScript)
- **Frontend:** React / Next.js *(Planlanan stack'e göre burayı güncelleyebilirsin)*
- **Database:** SQLite / PostgreSQL
- **Deployment:** Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) (Optional, but recommended)

### Local Development

1. **Clone the repository**
   ```bash
   git clone [https://github.com/Dev-Emree/Statu.git](https://github.com/Dev-Emree/Statu.git)
   cd statu
   ```
2. Install dependencies

   ```Bash
   npm install
   ```

3. Run the development server

   ```Bash
   npm run dev
   ```
Open your browser and navigate to `http://localhost:3000`.

## 🗺️ Roadmap

We are currently in the early stages of development. Here is the plan:
- [ ] Core Monitoring Engine (HTTP/TCP/Ping)
- [ ] Basic Dashboard UI
- [ ] Notification System (Email & Webhooks)
- [ ] Public Status Pages
- [ ] User Authentication & Multi-user support
- [ ] Docker Image Release (v1.0.0)

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project

2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)

3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)

4. Push to the Branch (`git push origin feature/AmazingFeature`)

5. Open a Pull Request

Please read our [Contribution Guidelines](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## 📝 License

Distributed under the AGPLv3 License. See LICENSE for more information.

<div align="center">
<sub>Built with ❤️ by <a href="https://github.com/Dev-Emree">Dev-Emree</a> and contributors.</sub>
</div>
