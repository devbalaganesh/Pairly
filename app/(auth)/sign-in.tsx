import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignIn, useAuth } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import images from "@/assets/constants/images";

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();


  React.useEffect(() => {
    if (isSignedIn) router.replace("/");
  }, [isSignedIn]);


  const [mode, setMode] = React.useState<"phone" | "email">("phone");


  const [countryCode, setCountryCode] = React.useState<CountryCode>("IN");
  const [callingCode, setCallingCode] = React.useState("91");
  const [phoneNumber, setPhoneNumber] = React.useState("");


  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

 
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");


const onPhoneLoginPress = async () => {
  if (!isLoaded || !signIn) return;

  const fullPhone = `+${callingCode}${phoneNumber}`;

  try {
 
    const attempt = await signIn.create({
      identifier: fullPhone,
    });

 
    const phoneFactor = attempt.supportedFirstFactors?.find(
      (f) => f.strategy === "phone_code"
    );

    if (!phoneFactor) {
      console.log("Phone code strategy not supported");
      return;
    }

 
    await signIn.prepareFirstFactor({
      strategy: "phone_code",
      phoneNumberId: phoneFactor.phoneNumberId, 
    });

    setPendingVerification(true);
  } catch (err: any) {
    const errCode = err?.errors?.[0]?.code;

    if (errCode === "unsupported_country_code") {
      setMode("email"); 
      return;
    }

    console.log("PHONE LOGIN ERROR:", JSON.stringify(err, null, 2));
  }
};

 
  const onEmailLoginPress = async () => {
    if (!isLoaded || !signIn) return;

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.log("EMAIL LOGIN ERROR:", JSON.stringify(err, null, 2));
    }
  };


  const onVerifyPress = async () => {
  if (!isLoaded || !signIn) return;

  try {
    const result = await signIn.attemptFirstFactor({
      strategy: "phone_code",   
      code,                     
    });

    if (result.status === "complete") {
      await setActive({ session: result.createdSessionId });
      router.replace("/");
    }
  } catch (err) {
    console.log("VERIFY ERROR:", JSON.stringify(err, null, 2));
  }
};



  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-6 bg-slate-50">
        <View className="bg-white px-7 py-9 rounded-2xl w-full max-w-[400px]">
          <Text className="text-2xl mb-2 font-bold">Verification</Text>

          <Text className="mb-5">
            Enter the code sent to +{callingCode} {phoneNumber}
          </Text>

          <TextInput
            placeholder="Enter OTP"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            className="border border-gray-300 rounded-xl bg-white px-4 py-4"
          />

          <TouchableOpacity
            onPress={onVerifyPress}
            className="bg-primaryPurple px-6 py-3 rounded-xl mt-4"
          >
            <Text className="text-white text-lg text-center font-bold">
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

         <Image
  source={mode === "email" ? images.emailicon2 : images.phone}
  className="w-12 h-12 mb-4"
/>


          <Text className="text-4xl mb-8 font-bold">
            Welcome back
          </Text>

          {mode === "phone" && (
            <View className="border border-gray-300 bg-white rounded-xl mb-5 px-4 py-3 flex-row items-center">
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
                autoCapitalize="none"
                placeholder="Enter your email"
                value={emailAddress}
                onChangeText={setEmailAddress}
                className="border border-gray-300 rounded-xl bg-white mb-5 px-4 py-4"
              />

              <TextInput
                secureTextEntry
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                className="border border-gray-300 rounded-xl bg-white px-4 py-4"
              />
            </>
          )}

        
          <TouchableOpacity
            onPress={() => setMode(mode === "phone" ? "email" : "phone")}
            className="mt-2"
          >
            <Text className="text-blue-600">
              {mode === "phone" ? "Use email instead" : "Use phone instead"}
            </Text>
          </TouchableOpacity>

    
          <TouchableOpacity
            onPress={
              mode === "phone" ? onPhoneLoginPress : onEmailLoginPress
            }
            className="bg-primaryPurple px-6 py-3 rounded-xl mt-5"
          >
            <Text className="text-white text-lg text-center font-bold">
              Continue
            </Text>
          </TouchableOpacity>

          {/* SIGNUP LINK */}
          <View className="flex-row justify-center mt-4 space-x-1">
            <Text className="text-gray-600">Don’t have an account?</Text>
            <Link href="/sign-up">
              <Text className="text-primaryPurple font-semibold">
                Sign up
              </Text>
            </Link>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
