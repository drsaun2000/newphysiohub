README - How to Deploy Your Backend to the Server

1. Open FileZilla/Mobaxterm.

2. In the top bar, enter the following to connect to the server:
   - Host: [YOUR_SERVER_IP]
   - Username: [YOUR_USERNAME]
   - Password: [YOUR_PASSWORD]
   - Port: 22

3. Click "Quickconnect".

4. On the right side (server), navigate to the folder where your project should be uploaded.
   Example: /var/www/yourproject

5. On the left side (your computer), find your backend project folder.

6. Drag and drop your project files from the left (your computer) to the right (server).
   - Replace existing files if needed.

7. If your project uses a package.json file, install dependencies:
   - Open your terminal or command prompt.
   - Connect to the server via SSH:
     ssh [YOUR_USERNAME]@[YOUR_SERVER_IP]
   - Navigate to your project folder:
     cd /var/www/yourproject
   - Run:
     npm install

8. To restart the backend service, run the following command:
   pm2 restart all

9. Your backend is now live.

Optional:
- If your project uses environment variables, upload your .env file via FileZilla to the same directory.
- To view logs if there's an issue, run:
  pm2 logs

Notes:
- PM2 will automatically keep your app running in the background.
- If the server is configured with Nginx, your app will be accessible at your domain or server IP.

You're all set!
