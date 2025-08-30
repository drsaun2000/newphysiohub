README - How to Deploy Your React Admin Panel to the Server

1. Open FileZilla.

2. In the top bar, enter the following to connect to the server:
   - Host: [YOUR_SERVER_IP]
   - Username: [YOUR_USERNAME]
   - Password: [YOUR_PASSWORD]
   - Port: 22

3. Click "Quickconnect".

4. On the right side (server), navigate to the directory where your admin panel should be served from.
   Example: /var/www/adminpanel

5. On the left side (your computer), go to your React project folder.

6. In your terminal or command prompt (on your computer), build the project:
   - Navigate to your project folder:
     cd /path/to/your-react-admin
   - Run the build command:
     npm run build

7. This will create a `build/` folder inside your project.

8. In FileZilla, upload the contents of the `build/` folder (not the folder itself) into:
   /var/www/adminpanel

   - Replace existing files if needed.

9. (Optional) If not already configured, set up Nginx to serve the React app:

------------------------------
Sample Nginx Config for React:

server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/adminpanel;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
------------------------------

10. To apply the Nginx config:

   - SSH into your server:
     ssh [YOUR_USERNAME]@[YOUR_SERVER_IP]

   - Create or edit the config:
     sudo nano /etc/nginx/sites-available/adminpanel

   - Paste the Nginx config above.

   - Enable the site:
     sudo ln -s /etc/nginx/sites-available/adminpanel /etc/nginx/sites-enabled/

   - Test and restart Nginx:
     sudo nginx -t
     sudo systemctl restart nginx

11. Your admin panel is now live.

12. Anytime you update your React app:
    - Run `npm run build` again.
    - Upload the new build files via FileZilla.
    - No need to restart Nginx or use PM2.

You're done!
