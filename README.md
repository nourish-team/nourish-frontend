# nourish

## Table of Contents
1. [Intro](##Intro):
    - About the project
    - Demo
    - Features
    - Technologies Used
2. [Getting Started](##GettingStarted):
    - Prerequisites
    - Installation
3. Basic Outline
    - APIs & Data
4. License
5. Contributing
6. Contact
7. Acknowledgments

## Intro
Nourish is a skincare tracking app designed to empower users in their skincare journey. 
Our goal is to provide a platform where users can journal and monitor the effectiveness of their skincare routine, helping them identify what products and combinations work best for them.

### About the project

With nourish, users can easily create their personalized skincare routine by searching for products by brand and adding them to their routine. 
To enhance customization, users have the option to include tags that describe the targeted skin type and the preferred weather conditions for the routine.

Once a routine is created, users can journal about their experiences by adding journal entries and even uploading photos of their skin.
These journal entries are stored in the user's history, allowing them to track progress and observe any changes over time.

In addition to personal tracking, nourish enables users to explore and engage with the routines of others. Users can browse through a collection of routines and like them.
Liked routines are conveniently saved for future reference, providing inspiration and allowing users to implement ideas from other skincare enthusiasts.

Nourish aims to be a comprehensive companion for skincare enthusiasts, fostering a community where users can learn from one another and make informed decisions about their skincare routine.

### Feautures 

- User registration, login, and authentication using Firebase
- Create and manage multiple skincare routines
- Add products to routines with product details
- Journal and view journal entries
- Discover other users' skincare routines by filtering
- Integrating an API to display real-time weather information

### Technologies Used

- ![React Native](https://img.shields.io/badge/React%20Native-blue?logo=react)
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
- ![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)
- ![Firebase](https://img.shields.io/badge/Firebase-blue?logo=react)
- ![React Native](https://img.shields.io/badge/Firebase-gray?logo=firebase&logoColor=FFCA28)
- ![Cloudinary](https://img.shields.io/badge/Cloudinary-407AFC)
- ![Google Play](https://img.shields.io/badge/Google%20Play-414141?logo=googleplay)

## Getting Started

### Prerequisites

To initiate the authentication process, please ensure you have a Firebase account set up. If you don't have one, you can easily create an account by following the provided link.
Additionally, it is necessary to fork the server-side repository of Nourish. You can find the repository at the following link: [Nourish backend Github](https://github.com/nourish-team/nourish-backend)

To deploy our mobile app, we utilized ![Google Play](https://img.shields.io/badge/Google%20Play-414141?logo=googleplay). If you plan on leveraging ![Google Play](https://img.shields.io/badge/Google%20Play-414141?logo=googleplay), it's important to note that you'll need to create a ![Google Play](https://img.shields.io/badge/Google%20Play-414141?logo=googleplay) account, which involves a cost. Additionally, bundling the application is a prerequisite for deploying it on Google Play. However, there may be challenges involved in the bundling process, especially when using ![React Native](https://img.shields.io/badge/Firebase-gray?logo=firebase&logoColor=FFCA28). It is advisable to familiarize yourself with the steps for bundling an Expo app for deployment 

### Installation

_Bellow you will find the basic installation and set up._

1. Clone the repo
```sh
git clone https://github.com/your_username_/Project-Name.git
```
2. Module Installation
```sh
npm install
```
3. Running expo
```sh
npm expo start
```

## Basic Outline

### APIs & Data

The major APIs we used where: 
   
- ![Firebase](https://img.shields.io/badge/Firebase-blue?logo=react) :
  
Firebase is a Backend as a Service (BaaS) platform provided by Google. It offers a range of services and tools that aid in app development, such as user authentication, real-time database, cloud storage, and cloud messaging. 
In this particular case, we used Firebase for user authentication, ensuring that users can securely register and log in to safeguard their data.

- Seeding skincare data:

Since free skincare APIs are hard to come by, we seeded our database with the data provided by [Laura Robertson](https://github.com/LauraRobertson/skincareAPI). Without this data this project was not possible in two weeks’ time. 

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! If you would like to contribute to nourish, please follow these steps:

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/newSexyFeature)
3. Commit your Changes (git commit -m 'Add some newSexyFeature')
4. Push to the Branch (git push origin feature/newSexyFeature)
5. Open a Pull Request

## Contact

- Anissa Chadouli
- Lisa
- Asako Ueno
- Sean
- Chai

## Acknowledgments

- [Shields.io](https://shields.io/)
  
