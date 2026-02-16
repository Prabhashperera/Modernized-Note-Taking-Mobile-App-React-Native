# QuickNotes - Modern Vision Pro Styled Note App 📝✨

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![React Native](https://img.shields.io/badge/React_Native-Expo-000000?style=flat&logo=react&logoColor=61DAFB) ![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-FFCA28?style=flat&logo=firebase&logoColor=black)

A futuristic, cross-platform mobile application for managing personal notes. Built with React Native (Expo) and styled with a "Vision Pro" inspired glassmorphism theme, this app features real-time synchronization, biometric-style authentication, and AI-powered text-to-speech.

## 📱 Features

* **🔐 Secure Authentication:** User registration and login powered by Firebase Authentication.
* **☁️ Real-time Cloud Storage:** All notes are synced instantly across devices using Cloud Firestore.
* **🎨 Vision Pro UI:** A stunning dark mode interface with glassmorphism cards, neon accents, and fluid animations.
* **📌 Pinned Notes:** Keep your most important thoughts at the top of the list with a golden pin toggle.
* **🔍 Instant Search:** Filter through your notes in real-time with a sleek glass search bar.
* **🗣️ AI Read Aloud:** Listen to your notes with a futuristic text-to-speech feature.
* **🎤 Voice Dictation Support:** Integrated microphone trigger for easy voice typing.
* **📤 Native Sharing:** Share your notes directly to WhatsApp, Email, or other apps.

## 🛠 Tech Stack

* **Frontend Framework:** React Native (Expo SDK 52)
* **Language:** JavaScript / React
* **Styling:** NativeWind (Tailwind CSS for React Native)
* **Backend / Database:** Firebase Firestore
* **Authentication:** Firebase Auth
* **Navigation:** React Navigation (Native Stack)
* **Icons:** Ionicons (@expo/vector-icons)
* **Speech:** Expo Speech

## 🚀 Setup & Installation

Follow these instructions to run the project locally on your machine.

### Prerequisites
* Node.js installed (v18 or higher recommended)
* Expo Go app installed on your iOS or Android device

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/PrabashPerera/modernized-note-taking-mobile-app-react-native.git](https://github.com/PrabashPerera/modernized-note-taking-mobile-app-react-native.git)
    cd quicknotes
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *If you encounter peer dependency warnings, you can try `npm install --legacy-peer-deps`*

3.  **Configure Firebase:**
    * Create a `firebase.js` file in the `app/` directory if it doesn't exist (it should be included in the repo, but ensure your API keys are valid).
    * Ensure your Firestore security rules allow reads/writes for authenticated users.

4.  **Start the application:**
    ```bash
    npx expo start --clear
    ```

5.  **Run on Device:**
    * Scan the QR code displayed in the terminal using the **Expo Go** app on your phone.
    * Alternatively, press `a` for Android Emulator or `i` for iOS Simulator.

## 📂 Project Structure
<img width="792" height="517" alt="Screenshot 2026-02-17 014509" src="https://github.com/user-attachments/assets/ff3701af-9666-4b2f-b62a-eefdf948d033" />

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 👤 Author

**Prabash M Perera**
* **GitHub:** [PrabashPerera](https://github.com/PrabashPerera)
* **Role:** Full-Stack Developer Student

---
*Developed for Module ITS 2127 - Advanced Mobile Developer (AMD)*
