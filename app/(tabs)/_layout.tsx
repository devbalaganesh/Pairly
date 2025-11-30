import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import images from "@/assets/constants/images";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useSignUp } from "@clerk/clerk-expo";

const Signup = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const [pendingEmailVerification, setPendingEmailVerification] = React.useState(false);
  const [pendingPhoneVerification, setPendingPhoneVerification] = React.useState(false);

  const [code, setCode] = React.useState("");

  // -----------------------------
  // SIGN UP (CREATE USER)
  // -----------------------------
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        phoneNumber,
        password,
      });

      // Send email OTP first
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingEmailVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // -----------------------------
  // VERIFY EMAIL
  // -----------------------------
  const onVerifyEmailPress = async () => {
    if (!isLoaded) return;

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete" || result.verifications.emailAddress.status === "verified") {
        // Now send SMS OTP
        await signUp.preparePhoneNumberVerification({
          strategy: "phone_code",
        });

        setCode("");
        setPendingEmailVerification(false);
        setPendingPhoneVerification(true);
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // -----------------------------
  // VERIFY PHONE
  // -----------------------------
  const onVerifyPhonePress = async () => {
    if (!isLoaded) return;

    try {
      const result = await signUp.attemptPhoneNumberVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        console.error("More steps required");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // ===========================================================
  // EMAIL VERIFICATION SCREEN
  // ===========================================================
  if (pendingEmailVerification) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-6 bg-slate-50">
        <View className="bg-white px-7 py-9 rounded-2xl w-full max-w-[400px]">
          <Text className="font-JakartaExtraBold text-2xl mb-3">Verify Email</Text>

          <Text className="font-Jakarta mb-5">
            We sent a verification code to {emailAddress}.
          </Text>

          <TextInput
            placeholder="Enter code"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            className="border border-gray-300 rounded-xl bg-white px-4 py-4"
          />

          <TouchableOpacity
            onPress={onVerifyEmailPress}
            className="bg-primaryPurple px-6 py-3 rounded-xl active:opacity-80 mt-4"
          >
            <Text className="text-white text-lg font-semibold text-center">Verify</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ===========================================================
  // PHONE VERIFICATION SCREEN
  // ===========================================================
  if (pendingPhoneVerification) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-6 bg-slate-50">
        <View className="bg-white px-7 py-9 rounded-2xl w-full max-w-[400px]">
          <Text className="font-JakartaExtraBold text-2xl mb-3">Verify Phone</Text>

          <Text className="font-Jakarta mb-5">
            We've sent an SMS code to {phoneNumber}.
          </Text>

          <TextInput
            placeholder="12345"
            value={code}
            keyboardType="numeric"
            onChangeText={setCode}
            className="border border-gray-300 rounded-xl bg-white px-4 py-4"
          />

          <TouchableOpacity
            onPress={onVerifyPhonePress}
            className="bg-primaryPurple px-6 py-3 rounded-xl active:opacity-80 mt-4"
          >
            <Text className="text-white text-lg font-semibold text-center">Verify</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-4 py-10">
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
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              className="border border-gray-300 rounded-xl bg-white mb-5 px-4 py-4"
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              className="border border-gray-300 rounded-xl bg-white px-4 py-4"
            />

            <Text className="font-playfairMedium text-gray-600 text-sm leading-5 mt-3">
              Pairly will send verification codes to your email and phone.
            </Text>

            <TouchableOpacity
              onPress={onSignUpPress}
              className="bg-primaryPurple px-6 py-3 rounded-xl active:opacity-80 mt-4"
            >
              <Text className="text-white text-lg font-semibold text-center font-playfairBold">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;
