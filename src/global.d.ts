import type { ComponentType, ReactNode } from 'react';

declare module '@react-three/fiber' {
  export const Canvas: (props: { children?: ReactNode; [key: string]: any }) => JSX.Element;
  export function useFrame(callback: (...args: any[]) => void): void;
  export function useThree(): Record<string, any>;
  export function extend(objects?: Record<string, any>): void;
}

declare module '@react-three/drei' {
  export const Text: ComponentType<any>;
  export const Html: ComponentType<any>;
  export const Stars: ComponentType<any>;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      [elementName: string]: any;
    }
  }
}

export {};
