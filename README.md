# Emergency Data Eraser

**Emergency Data Eraser** is inspired by Episode 25 of *Death Note*. With a single button on a controller, it can trigger the deletion of files specified in a configuration file **simultaneously on all connected devices**.

---

## Installation

1. **Download or clone the repository**.

2. **Create a MySQL database** with a table that has a single row and a single column. Set the initial value to `0`.

3. **Upload server files**:
   - Place the contents of the `/server` folder on an FTP server accessible by all computers.
   - Update the credentials inside the server files to connect to your MySQL database.
   - Adjust the queries in both server-side files according to your setup.

4. **Configure clients and parent**:
   - In `/child/index.html` and `/parent/index.html`, set the server URLs to match your server.
   - Connect a controller to the **parent device** and update `/parent/app/hidden.html` with the correct controller ID and button index. (Windows: Controller Management can help identify these.)

5. **Placement of applications**:
   - The **parent** application runs on the device with the controller attached.
   - The **child** applications run on all other devices.

6. **Install dependencies and start applications**:
```bash
npm install
npm start
````

* Make sure the applications remain running at all times.

---

## Usage Notes

* There is **no option to close the fullscreen windows** within the application. Use `Alt+F4` for the windows and `Ctrl+C` in the console if needed.
* Every use of the application **permanently changes the database value from 0 to 1**. Be sure to manually reset it to `0` in the database before the next use, otherwise the child applications will immediately launch as soon as they detect `1`.
* Ensure all client devices can reach the server via the network.

---

## Functionality

* **Parent application** listens for controller input. Pressing the configured button triggers the workflow.
* **Child applications** poll the server every second. When `1` is detected:

  * Fullscreen windows open on all monitors.
  * A sound is played to indicate activation.
  * Files and folders specified in `paths.json` are deleted automatically.
* Works cross-platform: tested on Windows (parent) and Linux (child).

---

## Warning

⚠️ The application permanently deletes files and folders as configured. Use with extreme caution and double-check paths in `paths.json`.
