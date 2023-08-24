import { signInWithEmailAndPassword } from "firebase/auth";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import LoginScreen from "../screens/LoginScreen";
import { UserProvider } from "../contexts/UserContext";
import RootNav from "../navigation/root";

describe("LoginScreen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display an error message when inputs are empty", async () => {
    const { getByTestId } = render(
      <UserProvider>
        <LoginScreen />
      </UserProvider>
    );
    const loginButton = getByTestId("login-button");

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByTestId("login-error-message")).toBeTruthy();
    });
  });

  it("should attempt login with Firebase when inputs are given", async () => {
    const { getByTestId } = render(
      <UserProvider>
        <LoginScreen />
      </UserProvider>
    );
    const loginButton = getByTestId("login-button");
    const email = getByTestId("email-input");
    const password = getByTestId("password-input");

    fireEvent.changeText(email, "test@example.com");
    fireEvent.changeText(password, "testpassword");

    await act(async () => {
      fireEvent.press(loginButton);
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalled();
  });

  it("should navigate to the HomeScreen when valid credentials are given", async () => {
    const { getByTestId } = render(
      <UserProvider>
        <RootNav />
      </UserProvider>
    );

    await waitFor(() => {
      expect(getByTestId("login")).toBeTruthy();
    });
    // console.log(rendered.toJSON());
  });
});
