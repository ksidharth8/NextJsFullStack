
# 🕵️ MysteryMessage

**MysteryMessage** is a secure, ephemeral messaging platform built with Next.js and MongoDB. It allows users to send confidential messages that self-destruct after being read, ensuring privacy and discretion.

---

## ✨ Features

- 🔒 **End-to-End Encryption**: Messages are encrypted to ensure only the intended recipient can read them.
- 🧾 **Unique Message Links**: Each message generates a unique link for secure sharing.
- 📬 **No Account Required**: Send messages without the need to create an account.
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ksidharth8/NextJsFullStack.git
   cd NextJsFullStack/mysterymessage
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env.local` file in the root directory and add your MongoDB connection string:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🧪 Technologies Used

- [Next.js](https://nextjs.org/) – React framework for server-side rendering and static site generation.
- [MongoDB](https://www.mongodb.com/) – NoSQL database for storing messages.
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for styling.
- [Vercel](https://vercel.com/) – Deployment platform for frontend applications.

---

## 📁 Project Structure

```
mysterymessage/
├── components/       # Reusable React components
├── pages/            # Next.js pages
├── public/           # Static assets
├── styles/           # Global styles
├── utils/            # Utility functions
├── .env.local        # Environment variables
├── next.config.js    # Next.js configuration
└── package.json      # Project metadata and scripts
```

---

## 🛠️ Future Enhancements

- 📆 **Expiration Timers**: Set messages to expire after a certain time.
- 📊 **Analytics Dashboard**: Track message views and statistics.
- 🔔 **Email Notifications**: Notify recipients when a message is received.
- ⏳ **Self-Destructing Messages**: Messages automatically delete after being read once.


---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact

For any inquiries or feedback, feel free to reach out:

- **GitHub**: [ksidharth8](https://github.com/ksidharth8)
- **Email**: kumarsidharth333@gmail.com
