# Real Estate Management System

A comprehensive, modern web application designed for real estate developers to manage projects, inventory (blocks/plots), clients, bookings, and financials. Built with React and optimized for a premium user experience.

[Dashboard Preview](https://drive.google.com/file/d/1IJy42JwqL3LuuA-h5zmUTsgTLhdwr0XC/view)


## 🚀 Key Features

*   **Project & Inventory Management**:
    *   Create and manage multiple real estate projects.
    *   Define blocks and generate plots automatically with custom prefixes, sizes, and pricing.
    *   Visual status tracking for plots (Available, Booked, Sold).
*   **Client & Booking System**:
    *   Register clients with CNIC, contact details, and images.
    *   **New**: Create secure bookings with installment plans (custom duration, advance payment).
    *   **Plot Transfer**: Seamlessly transfer plot ownership to existing or new clients.
*   **Financial Management**:
    *   Track installment payments, generate receipts (Thermal/A4).
    *   View comprehensive financial reports and transaction history.
    *   Dashboard with key metrics (Total Sales, Recovery, Pending Dues).
*   **Document Management**:
    *   Upload and attach important documents (PDFs, Images) to specific plots.
    *   Integrated file viewer.
*   **Customization**:
    *   **Local Logo Upload**: uploading your company branding directly from settings.
    *   Print-ready reports for "Pending Installments" and "Payment History".

## 🛠️ Tech Stack

*   **Frontend**: React.js (Vite)
*   **Styling**: Tailwind CSS (with custom design system)
*   **State Management**: Zustand (with local persistence)
*   **Icons**: FontAwesome 6
*   **Routing**: React Router DOM

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/real-estate-manager.git
    cd real-estate-manager
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 📖 Usage Guide

### Initial Setup
1.  On first launch, you will be greeted by the **Onboarding** screen.
2.  Enter your **Company Name** and upload your **Company Logo**.
3.  Set up your contact details (Email, Phone).

### Managing Inventory
1.  Go to **Projects** -> **New Project**.
2.  Open the project and click **Add Block**.
3.  Define the number of plots, size, and price to auto-generate inventory.

### Booking a Plot
1.  Navigate to **Clients & Bookings**.
2.  Click **New Booking**.
3.  Select a client (or create new), choose a plot, and define the payment plan (Total Amount, Advance, Installments).

### Transferring Ownership
1.  Open the **Plot Details** for any booked plot.
2.  In the *Client Info* section, click **Transfer**.
3.  Select an existing client OR register a **New Client** instantly to transfer ownership.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

[MIT](LICENSE)
