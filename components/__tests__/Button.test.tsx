import { fireEvent, render } from "@testing-library/react-native";

import Button, { ButtonType } from "../Button";

describe("Button component", () => {
  test("renders correctly", () => {
    const onPress = jest.fn();
    const buttonComp = render(<Button text="Hello" onPress={onPress} />);
    const { getByText } = buttonComp;
    const text = getByText("Hello");
    fireEvent.press(text);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test.each([
    ["primary", "text-white", "bg-black"],
    ["secondary", "text-neutral-400", "bg-white border-neutral-400"],
  ])("type %s should have the correct styling", (type, textClassName, viewClassName) => {
    const buttonComp = render(<Button text="Hello" type={type as ButtonType} onPress={() => {}} />);
    const { getByText } = buttonComp;
    const text = getByText("Hello");
    expect(text.parent.props.className.includes(textClassName)).toBe(true);
    expect(text.parent.parent.props.className.includes(viewClassName)).toBe(true);
  });
});
