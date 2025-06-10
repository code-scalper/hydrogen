import * as React from "react";
import { Select } from "radix-ui";
import classnames from "classnames";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import "@/css/select.css";
import * as RadixSelect from "@radix-ui/react-select";

interface selectItemInterface {
  key: string;
  label: string;
  data?: any;
}
interface SelectBoxInterface {
  placeholder?: string;
  selectItems: selectItemInterface[];
}

const SelectItem = React.forwardRef<
  HTMLDivElement,
  RadixSelect.SelectItemProps & { className?: string }
>(({ children, className, ...props }, forwardedRef) => (
  <RadixSelect.Item
    className={classnames("SelectItem", className)}
    {...props}
    ref={forwardedRef}
  >
    <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    <RadixSelect.ItemIndicator className="SelectItemIndicator">
      <CheckIcon />
    </RadixSelect.ItemIndicator>
  </RadixSelect.Item>
));

SelectItem.displayName = "SelectItem"; // ⚠️ forwardRef에는 필수!
const SelectBox = ({
  placeholder = "Please select!",
  selectItems,
}: SelectBoxInterface) => (
  <Select.Root>
    <Select.Trigger
      className={classnames("SelectTrigger", "flex-1 bg-gray-700 text-white")}
      aria-label="Food"
    >
      <div></div>
      <Select.Value placeholder={placeholder} />
      <Select.Icon className="SelectIcon">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        className={classnames("SelectContent", "bg-gray-700 text-white")}
      >
        <Select.ScrollUpButton className="SelectScrollButton">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="SelectViewport">
          <Select.Group>
            {/* <Select.Label className="SelectLabel">Fruits</Select.Label> */}
            {selectItems.map((item, index) => (
              <SelectItem key={index} value={item.key}>
                {item.label}
              </SelectItem>
            ))}
          </Select.Group>
          {/* 
          <Select.Separator className="SelectSeparator" />

          <Select.Group>
            <Select.Label className="SelectLabel">Vegetables</Select.Label>
            <SelectItem value="aubergine">Aubergine</SelectItem>
            <SelectItem value="broccoli">Broccoli</SelectItem>
            <SelectItem value="carrot" disabled>
              Carrot
            </SelectItem>
            <SelectItem value="courgette">Courgette</SelectItem>
            <SelectItem value="leek">Leek</SelectItem>
          </Select.Group>

          <Select.Separator className="SelectSeparator" />

          <Select.Group>
            <Select.Label className="SelectLabel">Meat</Select.Label>
            <SelectItem value="beef">Beef</SelectItem>
            <SelectItem value="chicken">Chicken</SelectItem>
            <SelectItem value="lamb">Lamb</SelectItem>
            <SelectItem value="pork">Pork</SelectItem>
          </Select.Group>*/}
        </Select.Viewport>
        <Select.ScrollDownButton className="SelectScrollButton">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

export default SelectBox;
