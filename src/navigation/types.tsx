export type RootStackParamList = {
  WelcomeScreen: undefined;
  Login: undefined;
  Signup: undefined;
  HomeScreen: undefined;
  SkincareType: { skincareType: string };
  UserPageScreen: undefined;
  UserRoutinePageScreen: {
    routineId: number;
    routineName: string;
    routineProduct: number[];
    routineDescription: string | null;
  };
  AddJournalScreen: { routineId: number };
  SearchToAddScreen: {
    routineId: number;
    routineName: string;
    routineProduct: number[];
    routineDescription: string | null;
  };
  JournalHistoryScreen: { routineId: number; routineName: string };
  CreateNewRoutineScreen:
    | undefined
    | {
        selectedItems: (number | { itemId: number; itemName: string })[];
      };

  SearchToAddNewScreen: {
    selectedItems: (number | { itemId: number; itemName: string })[];
  };

  WeatherType: { weatherType: string };
  TopTen: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  UserPage: undefined;
  Likes: undefined;
  Account: undefined;
};
