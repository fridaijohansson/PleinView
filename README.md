- PleinView - 
 
 A React Native app that helps outdoor painters collect painting spots, compare their results to real-world references, and plan ahead by tracking the weather.

----------------

PleinView has 3 main screens (inside the (tab) folder): 
- A map view (map.jsx) that renders saved locations and an overview of completed artwork.
- A gallery view (gallery.jsx) that collects all the uploaded entries allowing the user to compare real-world references with their final artworks, in addition to any notes, datetime, and locaiton information.
- A weather view (weather.jsx) that displays the user's current weather forecase (up to 3 days) and allows the user to search locations accessing their weather forecast and save them for tracking.

PleinView also have secondary screens such as settings.jsx, and upload.jsx. 

The app utilises the Camera and Location Hardware APIs.

The app use AsyncStorage to save data locally, and Expo File System to upload and store images. 

The weather forecast is supplied by the weather API - WeatherAPI.com. The API key is saved in the .env as EXPO_PUBLIC_WEATHER_API_KEY and is used /services/WeaterService.js (key is not included for security.)
This Service file handles all API calls to the weather API and proivdes functionality to get forecast by coordnaites, and by city name. Historical weather is also accessible using coordinates and date and time.

-------- How to install: --------

1. Open a folder in Visual Studio Code - or your preferred development environment and open the terminal
2. Clone the repository from GitHub (https://github.com/fridaijohansson/PleinView) - install git here: https://git-scm.com/downloads
   - Run this command in the terminal:
    git clone https://github.com/fridaijohansson/PleinView.git

3. navigate into the cloned repo:
    cd PleinView
   - open the code using this command:
     code .
     
5. Install all the project's required dependencies mentioned in app.json, using Node Package Manager which is provided when installing Node.js
   - Install Node.js (https://nodejs.org/en/download/)
   - When successfully installed, run this command:
    Npm install
  
6. Install Expo Go on your phone https://expo.dev/go
  - Using Google Play or the App Store

4. Start the development server through the terminal using NPX:
  Npx expo start

6. Open PleinView using Expo Go
  - Check that your phone and computer are on the same Wi-Fi
  - Scan the QR code in the terminal using Expo Go

App will launch on your device


-------- How to Use: --------

- The app launches on the map view and a location permission request will be displayed. If granted will access the device's current geolocation. If denied will assign London as defualt location.
  
- The settings page is accessible through the top banner. This page allows the user to:
  - Trigger another location permission request pop-up, in the case that the first request was denied.
  - Set a custom defualt location, instead of London.
  - Or if permission is granted, and in the case a custom location is set - allows the user to assign the device's current location instead.
 
- Navigating back, the user can then access the gallery view. This is the CRUD functionality for uploads.
  Create:
  - Clicking on the floating button directs the user to the upload.jsx screen.
  - Using camera capture your painting and real-world reference - or use gallery to select images to upload.
  - Input the date and time of the session, select the location and give it a name, provide the title of the artwork and any notes.
  - Click "Save" to save the entry.
  View:
  - The gallery.jsx screen will display the new upload, when clicked will display a detailed pop-up of the entry. Clicking the image toggles the artwork and the real-world reference.
  - The uplaod can also be seen on the map.jsx screen as a marker. When the marker is clicked, will display a pop-up of the artwork and date. If you have more uploads, these can be horisontally scrolled through using the pop-ups.
  Update:
  - Using the detailed view on the gallery.jsx screen, and clicking on the pen, allows the user to update the entry in upload.jsx screen.
  - The upload details will be populated in the inputs, change any information and save to apply the changes.
  Delete:
  - In the detailed view on the gallery.jsx screen, click delete on the entry.
    
- The weather.jsx screen allows the user to see their current locations weather and forecast.
  Create:
  - To track a location, search the name of the location in the search bar. Then click the plus (+) to save it.
  View:
  - To view the locations weather, click on the location name and scroll through the forecast cards.
  - The saved locations are displayed on the map.jsx screen, as another type of marker. Clicking on it will display the forecast cards as well.
  Delete:
  - Click on the delete button next to the location name to remove the saved location. 









