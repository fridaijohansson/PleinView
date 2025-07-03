# PleinView 

A React Native app that helps outdoor painters collect painting spots, compare their results to real-world references, and plan ahead by tracking the weather. 

## Screens 

**PleinView** 

has 3 main screens (inside the (tab) folder): 
1. **Map view** (`map.jsx`) 

- Displays markers for saved painting locations. 
- Shows an overview of uploaded artwork. 2. 

**Gallery view** (`gallery.jsx`) 

- Collects all user uploads, including artwork and real-world references. 
- Displays metadata such as notes, date/time, and geolocation. 
- Includes full CRUD functionality. 

2. **Weather view** (`weather.jsx`) 

- Shows the user's current location forecast (up to 3 days). 
- Allows users to search and save forecasts for specific locations. Additional screens: 
- `settings.jsx` – manage permissions and default location. 
- `upload.jsx` – handles uploading artwork and reference photos. 

--- 

## Technologies Used 

- **React Native + Expo** 
- **AsyncStorage** – local data persistence 
- **Expo FileSystem** – image upload and storage 
- **Camera & Location APIs** – capture and geotag entries 
- **[WeatherAPI.com](https://www.weatherapi.com/)** - weather forecast data 
    - API key stored securely in `.env` as: `EXPO_PUBLIC_WEATHER_API_KEY` 
    - Used in `/services/WeatherService.js` to: 
    - Get forecasts by coordinates or city name 
    - Retrieve historical weather data 
    
--- 

## Installation Guide: 

### Prerequisites 

- Download [Git](https://git-scm.com/downloads) 
- Downlaod [Node.js & npm](https://nodejs.org/en/download/) 
- Get [Expo Go](https://expo.dev/go) on your mobile device
- Have a code editor like [Visual Studio Code](https://code.visualstudio.com/) 
- Get a free Weather API key from WeatherAPI.com 
 
---

1. **Open your development environment** 

2. **Clone the repository from GitHub** 

[Git Repo](https://github.com/fridaijohansson/PleinView) 

Run this command in the terminal: 
`git clone https://github.com/fridaijohansson/PleinView.git` 

3. **Navigate into the cloned repo** 

Open project folder in terminal:
`cd PleinView` 

Open the folder code in another window:
`code . `

4. **Install dependencies** 

Install all the project's required dependencies mentioned in app.json using this command: 
`npm install`  

5. **Add the Weather API key to .env file**

Create a .env file and add the Weather API key using this variable name:
`EXPO_PUBLIC_WEATHER_API_KEY = ‘ [API KEY] ’`

6. **Start the development server** 

Through the terminal using NPX: 
`npx expo start` 

7. **Open PleinView using Expo Go** 

- Check that your phone and computer are on the same Wi-Fi 
- Scan the QR code in the terminal using Expo Go 

PleinView will now launch on your device 

---

## How to Use: 

1. The app launches on the map view and a location permission request will be displayed. If granted will access the device's current geolocation. If denied will assign London as defualt location. 

2. The settings page is accessible through the top banner. This page allows the user to: 

- Trigger another location permission request pop-up, in the case that the first request was denied. 
- Set a custom defualt location, instead of London. 
- Or if permission is granted, and in the case a custom location is set 
- allows the user to assign the device's current location instead. 

3. Navigating back, the user can then access the gallery view. This is the CRUD functionality for uploads: 

**Create:** 

- Clicking on the floating button directs the user to the upload.jsx screen. 
- Using camera capture your painting and real-world reference - or use gallery to select images to upload. 
- Input the date and time of the session, select the location and give it a name, provide the title of the artwork and any notes. 
- Click "Save" to save the entry. 

**View:** 

- The gallery.jsx screen will display the new upload, when clicked will display a detailed pop-up of the entry. Clicking the image toggles the artwork and the real-world reference. 
- The uplaod can also be seen on the map.jsx screen as a marker. When the marker is clicked, will display a pop-up of the artwork and date. If you have more uploads, these can be horisontally scrolled through using the pop-ups. 

**Update:** 

- Using the detailed view on the gallery.jsx screen, and clicking on the pen, allows the user to update the entry in upload.jsx screen. 

- The upload details will be populated in the inputs, change any information and save to apply the changes.

**Delete:** 

- In the detailed view on the gallery.jsx screen, click delete on the entry. 

The weather.jsx screen allows the user to see their current locations weather and forecast. 

**Create:** 

- To track a location, search the name of the location in the search bar. Then click the plus (+) to save it. 

**View:** 

- To view the locations weather, click on the location name and scroll through the forecast cards. 
- The saved locations are displayed on the map.jsx screen, as another type of marker. Clicking on it will display the forecast cards as well. 

**Delete:** 

- Click on the delete button next to the location name to remove the saved location. 

---
