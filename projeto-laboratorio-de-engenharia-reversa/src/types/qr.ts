import { Options } from "qr-code-styling";

export type DotStyle = "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded";
export type CornerSquareStyle = "dot" | "square" | "extra-rounded";
export type CornerDotStyle = "dot" | "square";
export type ColorType = "single" | "gradient";

export interface QRState extends Options {
  colorType: ColorType;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientType?: "linear" | "radial";
  gradientRotation?: number;
}
