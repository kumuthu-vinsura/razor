import { Meta, Story } from '@storybook/react';
import {
  ButtonWithInputProps,
  ButtonWithInput,
} from './ButtonWithInput.component';

export default {
  title: 'Organisms/ButtonWithInput',
  component: ButtonWithInput,
  argTypes: {
    onClick: { action: 'clicked' },
  },
  args: {
    isDisable: false,
    children: 'ButtonWithInput',
    inputPlaceholder: 'TYpeHere',
    inputSize: 8,
    maxInputLength: 8,
  },
} as Meta<ButtonWithInputProps>;

const Template: Story<ButtonWithInputProps> = args => (
  <ButtonWithInput {...args} />
);

export const Default = Template.bind({});
