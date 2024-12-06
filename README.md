
# **ProductivityMate**

A modern productivity web application to simplify and streamline your daily tasks. With features like a Calendar, Task Management, Reminders, and a Pomodoro Timer, **ProductivityMate** is designed to help you stay organized and productive.

## **Features**

- **Calendar**: Plan your days effortlessly with an integrated calendar.
- **Tasks**: Organize your tasks and prioritize your workload effectively.
- **Reminders**: Never forget important events or deadlines.
- **Pomodoro Timer**: Stay focused and productive using the Pomodoro technique.

## **Technologies Used**

### **Frontend**
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS for clean and responsive design

### **Backend**
- **Framework**: Spring Boot
- **Language**: Java
- **Build Tool**: Gradle

## **File Structure**

```
📦project-root
 ┣ 📂backend
 ┃ ┣ 📂src                # Spring Boot source code
 ┃ ┣ 📜build.gradle       # Gradle build configuration
 ┃ ┣ 📜settings.gradle    # Gradle settings
 ┃ ┗ 📜gradlew/gradlew.bat # Gradle wrapper scripts
 ┣ 📂frontend
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📜Navbar.tsx       # Navigation bar component
 ┃ ┃ ┗ 📜Footer.tsx       # Footer component
 ┃ ┣ 📂pages
 ┃ ┃ ┣ 📜_app.tsx         # App component for global styles and layout
 ┃ ┃ ┣ 📜_document.tsx    # Custom document structure
 ┃ ┃ ┗ 📜index.tsx        # Landing page (Home component)
 ┃ ┣ 📂styles
 ┃ ┃ ┗ 📜globals.css      # Global styles
 ┃ ┣ 📂public             # Static assets
 ┃ ┣ 📜tailwind.config.js # Tailwind CSS configuration
 ┃ ┣ 📜tsconfig.json      # TypeScript configuration
 ┃ ┣ 📜package.json       # Dependencies and scripts
 ┃ ┗ 📜postcss.config.mjs # PostCSS configuration
```

## **Upcoming Features**

- Implement a **Pomodoro Timer** for focus sessions.
- Implement a **Calendar** for scheduling and planning.
- Implement a **Tasks List** to manage daily to-dos effectively.
- Implement **Reminders** to notify users about important events or tasks via **email** or **text messages**.
- Develop a **desktop application** using Electron.js, allowing the user to run the app as a standalone desktop app.
- Run the backend codebase on an **AWS EC2** instance so that the application is always running for real-time reminders through emails and text messages.

## **License**

This project is licensed under the MIT License.

## **Contact**

If you have any questions or suggestions, feel free to reach out at **williamntlam@gmail.com**.
