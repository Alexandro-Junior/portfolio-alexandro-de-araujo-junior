import { Options } from "qr-code-styling";

export type DotStyle = "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded";
export type CornerSquareStyle = "dot" | "square" | "extra-rounded";
export type CornerDotStyle = "dot" | "square";
export type ColorType = "single" | "gradient";
export type QRTheme = "default" | "sketch" | "ink" | "marker" | "minimalist" | "tech";
export type QRTemplate = "url" | "wifi" | "whatsapp";

export interface QRState extends Options {
  colorType: ColorType;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientType?: "linear" | "radial";
  gradientRotation?: number;
  isDynamic?: boolean;
  dynamicLinkId?: string;
  dynamicTargetUrl?: string;
  theme?: QRTheme;
  template?: QRTemplate;
}
