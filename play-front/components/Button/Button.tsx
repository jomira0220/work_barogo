import styled, { css } from "styled-components";

const Sized = {
  xs: `
    --button-font-size: 12px;
    --button-padding: 6px 10px;
    --button-radius: 5px;
    // --button-font-weight:500;
    --button-font-size: var(--xsmall-font-size);
  `,
  sm: `
    --button-padding: 8px 15px;
    --button-radius: 5px;
    --button-font-size: var(--small-font-size);
    // --button-font-weight:500;
  `,
  md: `
    --button-padding: 12px 15px;
  `,
  lg: `
    --button-width: 100%;
  `,
};

const Variants = {
  color: `
    --button-color: var(--white-color-1);
    --button-bg-color: var(--play-color-1);
  `,
  color2: `
  --button-color: var(--play-color-1);
  --button-bg-color: var(--play-color-3);
  `,
  gray: `
    --button-color: var(--black-color-1);
    --button-bg-color: var(--gray-color-6);
  `,
  border: `
    --button-border-color: var(--play-color-1);
    --button-bg-color: var(--white-color-1);
    --button-color: var(--play-color-1);
  `,
  white: `
    --button-border-color: var(--gray-color-2);
    --button-bg-color: var(--white-color-1);
    --button-color: var(--black-color-1);
  `,
  darkgray: `
  --button-color: var(--white-color-1);
  --button-bg-color: var(--black-color-2);
  `,
  gradient: `
  --button-color: var(--white-color-1);
  --button-bg-color: linear-gradient(to left, var(--play-color-2), var(--play-color-1));
  border:none;
  `,
};

const StyledButton = styled.button<{
  size: string;
  $variant: string;
}>`
  cursor: pointer;
  width: var(--button-width, auto);
  font-size: var(--button-font-size, 14px);
  font-weight: var(--button-font-weight, 400);
  padding: var(--button-padding, 11px 16px);
  border-radius: var(--button-radius, 8px);
  background: var(--button-bg-color, var(--play-color-1));
  color: var(--button-color, #ffffff);
  border: 1px solid var(--button-border-color, transparent);
  ${({ size }) => {
    if (size === "xs") return Sized.xs;
    else if (size === "sm") return Sized.sm;
    else if (size === "md") return Sized.md;
    else if (size === "lg") return Sized.lg;
  }}
  ${({ $variant }) => {
    if ($variant === "color") return Variants.color;
    else if ($variant === "gray") return Variants.gray;
    else if ($variant === "border") return Variants.border;
    else if ($variant === "white") return Variants.white;
    else if ($variant === "darkgray") return Variants.darkgray;
    else if ($variant === "color2") return Variants.color2;
    else if ($variant === "gradient") return Variants.gradient;
  }}
`;

interface ButtonProps {
  sizeStyle: "xs" | "sm" | "md" | "lg";
  variantStyle:
    | "color"
    | "gray"
    | "border"
    | "white"
    | "darkgray"
    | "color2"
    | "gradient";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  type?: "button" | "submit";
}

const Button = ({
  disabled,
  sizeStyle,
  variantStyle,
  children,
  onClick,
  className,
  id,
  type,
}: ButtonProps) => {
  return (
    <StyledButton
      id={id}
      className={className}
      disabled={disabled}
      size={sizeStyle}
      $variant={variantStyle}
      onClick={onClick}
      type={type}
    >
      {children}
    </StyledButton>
  );
};
export default Button;
