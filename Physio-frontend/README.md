
README - How to Deploy Your Next.js Frontend to the Server

1. Open FileZilla.

2. In the top bar, enter the following to connect to the server:
   - Host: [YOUR_SERVER_IP]
   - Username: [YOUR_USERNAME]
   - Password: [YOUR_PASSWORD]
   - Port: 22

3. Click "Quickconnect".

4. On the right side (server), go to the folder where your frontend should be uploaded.
   Example: /var/www/yourfrontend

5. On the left side (your computer), find your Next.js project folder.

6. Drag and drop your frontend files from the left (your computer) to the right (server).
   - Replace existing files if needed.

7. Open your terminal or command prompt.
   - Connect to the server via SSH:
     ssh [YOUR_USERNAME]@[YOUR_SERVER_IP]

8. Navigate to your frontend folder:
   cd /var/www/yourfrontend

9. Install dependencies:
   npm install

10. Build the Next.js app:
    npm run build

11. Start the Next.js app using PM2:
    pm2 start npm --name "frontend" -- start

12. To restart the app in the future:
    pm2 restart all

Optional:
- If your project uses a .env file, upload it to the same folder via FileZilla before building.

To make the app public via a domain (or IP), make sure Nginx is configured like this:

----------------------------------
Sample Nginx Config (optional):

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;  # Or your Next.js port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
----------------------------------

Commands for Nginx setup (if not done already):
- sudo nano /etc/nginx/sites-available/frontend
- Paste the config above
- sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
- sudo nginx -t
- sudo systemctl restart nginx

That's it!
- Your frontend is now deployed and running with PM2.
- Use pm2 restart all anytime you update the files.
- Use pm2 logs to check output or errors.

You're all set!
