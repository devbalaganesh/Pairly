/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      fontFamily: {
        playfairBlack: ["PlayfairDisplay-Black"],
        playfairBold: ["PlayfairDisplay-Bold"],
        playfairExtraBold: ["PlayfairDisplay-ExtraBold"],
        playfairMedium: ["PlayfairDisplay-Medium"],
        playfairRegular: ["PlayfairDisplay-Regular"],
        playfairSemiBold: ["PlayfairDisplay-SemiBold"],
        poppinsBlack: ["Poppins-Black"],
        poppinsBold: ["Poppins-Bold"],
        poppinsExtraBold: ["Poppins-ExtraBold"],
        poppinsExtraLight: ["Poppins-ExtraLight"],
        poppinsLight: ["Poppins-Light"],
        poppinsMedium: ["Poppins-Medium"],
        poppinsRegular: ["Poppins-Regular"],
        poppinsSemiBold: ["Poppins-SemiBold"],
        poppinsThin: ["Poppins-Thin"],
        spaceMonoRegular: ["SpaceMono-Regular"],
      },
      colors: {
        primaryPurple: "#67295F",
        primaryRed: "#E55454",
        primaryTeal: "#A9CDCD",
        secondaryBeige: "#EEE1DB",
        secondaryLavender: "#BCA7C0",
        secondaryGray: "#757575",
        secondaryBlack: "#000000",
      },
    },
  },
  plugins: [],
};
