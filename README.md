# InnovateX 🚀

[![Next.js](https://img.shields.io/badge/Next.js-13-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-4-blue?style=flat&logo=prisma)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-3-brightgreen?style=flat&logo=clerk)](https://clerk.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-skyblue?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Postgres](https://img.shields.io/badge/Postgres-15-blueviolet?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-4-blue?style=flat&logo=docker)](https://www.docker.com/)

InnovateX is an AI-powered, low-code website builder that enables users to create stunning, responsive websites effortlessly. Simply describe your desired website, and InnovateX will generate the necessary frontend and backend code, including database integration and authentication. Deploy your project with minimal effort and utilize pre-designed templates to accelerate development.

🎥 **[Watch the Demo Video](https://youtu.be/your-demo-video)**

## 🚀 Features

- **AI-Driven Code Generation** - Generate Next.js frontend, backend APIs, and Prisma database schemas from prompts.
- **Browser-Based Preview** - Test and modify code directly in your browser.
- **Pre-Designed Templates** - Use or modify pre-built templates to speed up development.
- **One-Click Deployment** - Deploy instantly to Vercel from the app.
- **Authentication** - Seamless user management via Clerk.
- **Responsive Design** - Tailwind CSS ensures modern, mobile-friendly layouts.
- **Database Support** - PostgreSQL with Prisma ORM for powerful data management.
- **Containerized Development** - Use Docker for a consistent local development experience.
- **Automated Testing** - Built-in testing framework to ensure reliability and stability.

## 🔄 System Workflow

1. **Prompt Input** - Describe your desired website or upload a file structure.
2. **Step Generation** - AI agent analyzes and plans implementation steps.
3. **Code Generation** - Specialized AI agents generate frontend, backend, and database code.
4. **File Management** - Organized project structure stored for easy access.
5. **Web-Based Development** - Preview and iterate on your code in-browser.
6. **Deployment** - Deploy to Vercel with a single click.

## 🛠️ Tech Stack

- **Frontend:** Next.js, Tailwind CSS, ShadCN
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Clerk Auth
- **CI/CD:** Docker, GitHub Actions
- **Libraries:** WebContainer, ShadCN
- **Deployment:** Vercel

## 📌 Prerequisites

Ensure you have the following installed:
- **Node.js** v16+
- **npm** v7+ (or yarn/pnpm)
- **PostgreSQL** v15+
- **Docker** (optional for containerization)
- **Git** for repository cloning

You'll also need accounts for:
- [Clerk](https://clerk.com/) (authentication)
- [Vercel](https://vercel.com/) (deployment)
- [Agent.ai](https://agent.ai/) (AI services)

## ⚡ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rudra-iitm/InnovateX.git
   ```
2. **Install dependencies:**
   ```bash
   cd InnovateX
   npm install yarn -g
   yarn
   ```
3. **Set up environment variables:** Create a `.env.local` file and add:
   ```
   DATABASE_URL=your_database_url
   AGENT_AI_API_KEY=your_agent_ai_api_key
   CLERK_API_KEY=your_clerk_api_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VERCEL_API_KEY=your_vercel_api_key
   WEBHOOK_SECRET=your_svix_webhook_secret
   ```
4. **Run database migrations:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. **Start the development server:**
   ```bash
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to access InnovateX.

## 🐳 Running with Docker

Ensure Docker is installed and running:

```sh
docker compose up
```

Apply Prisma migrations:
```sh
docker-compose exec app npx prisma generate
```
```sh
docker-compose exec app npx prisma migrate
```

Stop the container:
```sh
docker-compose down
```

Add `-v` to remove volumes if needed.

## 👥 Team

- **Rudra Pratap Singh**
- **Sushant Wayal**
- **Ritam Dutta**
- **Rudra Pratap**

---

Made with ❤️ by the InnovateX Team

