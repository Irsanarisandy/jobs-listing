import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";

export type ButtonType = "primary" | "secondary";

interface ButtonProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
  text: string;
  type?: ButtonType;
  onPress: () => void;
}

const Button = ({ className, style, text, type = "primary", onPress }: ButtonProps) => {
  const viewBgColorClassName = type === "primary" ? "bg-black" : "bg-white border-neutral-400";
  const textColorClassName = type === "primary" ? "text-white" : "text-neutral-400";

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={`rounded-md border-2 py-4 ${viewBgColorClassName} ${className}`}
        style={style}
      >
        <Text className={`text-center text-xl ${textColorClassName}`}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
