export const fonts = {
  inter: {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semibold: "Inter-SemiBold",
    bold: "Inter-Bold",
  },
  plusJakarta: {
    regular: "PlusJakarta-Regular",
    medium: "PlusJakarta-Medium",
    semibold: "PlusJakarta-SemiBold",
    bold: "PlusJakarta-Bold",
  },
  // Direct font family names
  interRegular: "Inter-Regular",
  interMedium: "Inter-Medium",
  interSemiBold: "Inter-SemiBold",
  interBold: "Inter-Bold",
  plusJakartaRegular: "PlusJakarta-Regular",
  plusJakartaMedium: "PlusJakarta-Medium",
  plusJakartaSemiBold: "PlusJakarta-SemiBold",
  plusJakartaBold: "PlusJakarta-Bold",
} as const;

export type Fonts = typeof fonts;
