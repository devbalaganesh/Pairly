import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableNativeFeedbackComponent,
} from "react-native";
import images from "@/assets/constants/images";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

const Signup = () => {
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-4 py-10">
          
          {/* TOP SECTION */}
          <View>
            <Image source={images.emailicon2} className="w-12 h-12 mb-4" />

            <Text className="font-playfairBold text-4xl mb-8">
              What's your email?
            </Text>

            <TextInput
              value={emailAddress}
              onChangeText={setEmailAddress}
              placeholder="Enter your email"
              className="border border-gray-300 rounded-xl bg-white mb-5 px-4 py-4"
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              className="border border-gray-300 rounded-xl bg-white px-4 py-4"
            />

            {/* DISCLAIMER BELOW INPUTS */}
            <Text className="font-playfairMedium text-gray-600 text-sm leading-5 mt-3">
              Pairly will send you a text with a verification code. 
              Message and data rates may apply.
            </Text>
          </View>
          <View>
            
          </View>

          {/* FLEX SPACE BELOW */}
          <View className="flex-1" />

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;
