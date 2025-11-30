import { View, Text } from "react-native";
import { SignOutButton } from "./(auth)/SignOutButton";

const HomeScreen = () => {
  return (
    <View>
      <Text>hello</Text>

      {/* Render the signout button */}
      <SignOutButton />
    </View>
  );
};

export default HomeScreen;
