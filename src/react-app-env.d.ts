// src/react-app-env.d.ts

declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.png' {
  const content: string;
  export default content;
}
declare module '*.jpg' {
  const content: string;
  export default content;
}
declare module '*.jpeg' {
  const content: string;
  export default content;
}
declare module '*.gif' {
  const content: string;
  export default content;
}
declare module '*.bmp' {
  const content: string;
  export default content;
}
declare module '*.tiff' {
  const content: string;
  export default content;
}
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
declare module '*.json' {
  const value: any;
  export default value;
}
declare module '*.mp4' {
  const src: string;
  export default src;
}
