jest.mock("@react-navigation/native-stack", () => ({
  __esModule: true,
  createNativeStackNavigator: jest.fn(() => ({
    Navigator: jest.fn(),
    Screen: jest.fn(),
  })),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
  };
});

jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn(),
    signInWithEmailAndPassword: jest.fn(() => {
      return Promise.resolve({
        user: {
          uid: "testUid",
          email: "test@email.com",
        },
      });
    }),
  };
});

jest.mock("./utils/useAuthentication.ts", () => ({
  useAuthentication: jest.fn(() => ({ user: null })),
}));
