 Cub Scouts Organization Portal — Enterprise Management System

 Grade A Final HND Project
This is my Capstone Project for the HND in Web Development at **Glasgow Clyde College**, which received the highest possible grade (A). It is a comprehensive, full-stack management ecosystem designed to digitize the scouting experience for leaders, scouts, and parents.
Advanced System Architecture
Unlike standard web apps, this system handles **5 distinct user roles** with granular permissions:
* **Admins:** Full system governance and analytics.
* **Leaders:** Troop management and badge verification.
* **Helpers/Volunteers:** Skill-based event assignment.
* **Scouts & Parents:** Achievement tracking and event registration.


* **Full-Stack React & Node.js:** Built as a high-performance Single Page Application (SPA).
* **Database Management:** Utilized **Sequelize ORM** with MySQL to manage complex relational data (Badges, Events, User Achievement History).
* **Security Architecture:** Implemented **JWT (JSON Web Tokens)** for stateless authentication and **Bcryptjs** for secure credential hashing.
* **Media Processing Pipeline:** Integrated **Multer** and **Sharp** to handle, resize, and optimize photo uploads for the troop gallery.
* **Modern UI:** Developed with **Tailwind CSS** and **Framer Motion** for a fluid, accessible, and mobile-responsive experience.


* **Role-Based Access Control (RBAC):** Designed a complex middleware system to ensure users only access data relevant to their role.
* **Data Integrity:** Managed database migrations and seeders using Sequelize CLI to ensure a consistent environment across development and production.
* **Scalability:** The backend is designed with a RESTful controller-based structure, making it easy to add new features like "Gamification" or "Real-time Messaging."

1.  Clone the repository.
2.  Set up the `.env` file for JWT and Database credentials.
3.  Run `npx sequelize-cli db:migrate` to build the relational structure.
4.  Launch Backend (`npm start`) and Frontend (`npm start`).
