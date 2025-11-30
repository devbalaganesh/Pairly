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
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";

const Signup = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  // MODE: "phone" OR "email"
  const [mode, setMode] = React.useState<"phone" | "email">("phone");

  // phone fields
  const [countryCode, setCountryCode] = React.useState<CountryCode>("IN");
  const [callingCode, setCallingCode] = React.useState("91");
  const [phoneNumber, setPhoneNumber] = React.useState("");


  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");


  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

 
  const tryPhoneSignup = async () => {
    if (!isLoaded || !signUp) return;

    const fullPhone = `+${callingCode}${phoneNumber}`;

    try {
      await signUp.create({
        phoneNumber: fullPhone,
      });

      await signUp.preparePhoneNumberVerification({
        strategy: "phone_code",
      });

      setPendingVerification(true);
    } catch (err: any) {
      const errCode = err?.errors?.[0]?.code;

      if (errCode === "unsupported_country_code") {
    
        setMode("email");
        return;
      }

      console.error("PHONE SIGNUP ERROR:", JSON.stringify(err, null, 2));
    }
  };

 
  const tryEmailSignup = async () => {
    if (!isLoaded || !signUp) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err) {
      console.error("EMAIL SIGNUP ERROR:", JSON.stringify(err, null, 2));
    }
  };

  const onSignUpPress = () => {
    if (mode === "phone") tryPhoneSignup();
    else tryEmailSignup();
  };


  const onVerifyPress = async () => {
    if (!isLoaded || !signUp) return;

    try {
      let result;

      if (mode === "phone") {
        result = await signUp.attemptPhoneNumberVerification({ code });
      } else {
        result = await signUp.attemptEmailAddressVerification({ code });
      }

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err) {
      console.error("VERIFY ERROR:", JSON.stringify(err, null, 2));
    }
  };

 
  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-6 bg-slate-50">
        <View className="bg-white px-7 py-9 rounded-2xl w-full max-w-[400px]">
          <Text className="font-JakartaExtraBold text-2xl mb-2">
            Verification
          </Text>

          <Text className="font-Jakarta mb-5">
            {mode === "phone"
              ? `We sent an SMS code to +${callingCode} ${phoneNumber}`
              : `We sent a code to ${emailAddress}`}
          </Text>

          <TextInput
            placeholder="Enter code"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            className="border border-gray-300 rounded-xl bg-white px-4 py-4"
          />

          <TouchableOpacity
            onPress={onVerifyPress}
            className="bg-primaryPurple px-6 py-3 rounded-xl mt-4"
          >
            <Text className="text-white text-lg font-semibold text-center font-playfairBold">
              Verify
            </Text>
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
          <Image source={images.emailicon2} className="w-12 h-12 mb-4" />

          <Text className="font-playfairBold text-4xl mb-8">
            {mode === "phone"
              ? "What's your phone number?"
              : "What's your email?"}
          </Text>

          {mode === "phone" && (
            <View className="flex-row items-center border border-gray-300 bg-white rounded-xl mb-5 px-4 py-3">
              <CountryPicker
                withFilter
                withFlag
                withCallingCode={false}
                withCallingCodeButton={false}
                countryCode={countryCode}
                onSelect={(country) => {
                  setCountryCode(country.cca2 as CountryCode);
                  setCallingCode(country.callingCode[0]);
                }}
              />

              <Text className="ml-2 text-lg">+{callingCode}</Text>

              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="Phone number"
                className="flex-1 ml-2"
              />
            </View>
          )}

       
          {mode === "email" && (
            <>
              <TextInput
                value={emailAddress}
                onChangeText={setEmailAddress}
                placeholder="Enter your email"
                className="border border-gray-300 rounded-xl bg-white mb-5 px-4 py-4"
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                secureTextEntry
                className="border border-gray-300 rounded-xl bg-white px-4 py-4"
              />
            </>
          )}

   
          <TouchableOpacity
            onPress={() => setMode(mode === "phone" ? "email" : "phone")}
            className="mt-2"
          >
            <Text className="text-blue-600">
              {mode === "phone"
                ? "Use email instead"
                : "Use phone number instead"}
            </Text>
          </TouchableOpacity>

     
          <TouchableOpacity
            onPress={onSignUpPress}
            className="bg-primaryPurple px-6 py-3 rounded-xl active:opacity-80 mt-5"
          >
            <Text className="text-white text-lg font-semibold text-center font-playfairBold">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;
