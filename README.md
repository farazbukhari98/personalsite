# OI3 Tools

OI3 Tools is a Next.js application that provides various utilities for the OI3 team. Currently, it includes a QR code generator tool.

## Features

- QR Code Generator: Create customizable QR codes with options for adding icons or background images.

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/oi3-tools.git
   cd oi3-tools
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Contains the main pages and components of the application
  - `page.tsx`: The home page
  - `oi3-team-tools/`: OI3 team tools page
  - `qr-generator/`: QR code generator tool
- `public/`: Static assets
- `styles/`: Global styles

## Deployment

To deploy this website to a hosting service:

1. Build the project:
   ```
   npm run build
   ```

2. The built files will be in the `.next` directory. Upload these files to your hosting service.

3. Set up your hosting service to serve a Node.js application. You may need to set the following environment variables:
   - `NODE_ENV=production`
   - `PORT=3000` (or the port specified by your hosting service)

4. Start the application using:
   ```
   npm start
   ```

5. Configure your domain to point to the hosting service's provided URL.

For specific instructions on deploying to different hosting platforms, please refer to the Next.js deployment documentation: https://nextjs.org/docs/deployment

## Technologies Used

- Next.js
- React
- Tailwind CSS
- TypeScript

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
